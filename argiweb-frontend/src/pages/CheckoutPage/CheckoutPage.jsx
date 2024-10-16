import React, {useEffect, useState} from "react";
import axios from 'axios';
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import { Col, Form, Input, Button, Row, Select, Radio, Spin, Image, message } from "antd";
import { useNavigate } from 'react-router-dom';
import {LeftOutlined} from '@ant-design/icons'
import './CheckoutPage.scss';
import { getDetailUser } from "../../services/UserService";
import AuthModalComponent from "../../components/AuthModalComponent/AuthModalComponent";
import { createOrder } from "../../services/OrderService";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/slides/cartSlide";
import codImg from "../../assets/images/codImg.png"
import momoImg from "../../assets/images/momoImg.png"
import { useMutation } from '@tanstack/react-query';


const { Option } = Select;

const CheckoutPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cityData, setCityData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [wardData, setWardData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchCityData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
                );
                setCityData(response.data);
            } catch (error) {
                console.error('Error fetching city data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCityData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                if (userId) {
                    const userDetails = await getDetailUser(userId);
                    setUserData(userDetails.data);
                    form.setFieldsValue({
                        name: userDetails.data.name,
                        phone: userDetails.data.phone,
                        province: userDetails.data.address?.province,
                        district: userDetails.data.address?.district,
                        ward: userDetails.data.address?.ward,
                        street: userDetails.data.address?.street,
                    });
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [form, userId]);

    const handleCityChange = (cityName) => {
        const selectedCity = cityData.find((city) => city.Name === cityName);
        if (selectedCity) {
          setDistrictData(selectedCity.Districts);
          setWardData([]);
          form.setFieldsValue({
            district: undefined,
            ward: undefined,
          });
        }
      };
    
    const handleDistrictChange = (districtName) => {
        const selectedDistrict = districtData.find((district) => district.Name === districtName);
        if (selectedDistrict) {
          setWardData(selectedDistrict.Wards);
          form.setFieldsValue({
            ward: undefined,
          });
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts'));

    const subtotal = selectedProducts ? selectedProducts.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
    }, 0) : 0;
    
    const shippingFee = subtotal > 499000 ? 0 : 40000;
    
    const total = subtotal + shippingFee;

    const { mutate: addOrder, isLoading: orderLoading } = useMutation({
        mutationFn: (orderData) => createOrder(orderData),
        onSuccess: (data) => {
            console.log('Order created successfully');
            selectedProducts.forEach(product => {
                dispatch(removeFromCart({ id: product.id }));
            });
            localStorage.removeItem('selectedProducts');
            navigate('/thankyou')
        },
        onError: (error) => {
          console.error('Order create error', error);
        }
    });


    const handlePlaceOrder = async () => {
        const formData = form.getFieldsValue();
        const orderItems = selectedProducts.map(product => ({
            name: product.name,
            amount: product.quantity, 
            image: product.image,
            price: product.price,
            product: product.id
        }));

        const orderData = {
            orderProducts: orderItems,
            shippingInfo: {
                fullName: formData.name,
                phone: formData.phone,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                street: formData.street,
                addressType: formData.addressType,
            },
            paymentMethod: selectedPayment,
            totalPrice: total,
            user: userId || '',
        };
        if (!orderData.orderProducts.length || !orderData.shippingInfo.fullName || !orderData.paymentMethod || !orderData.totalPrice) {
            console.log("Missing required fields");
            return;
        }
        
        addOrder(orderData);
    };


    return (
        <WrapperBgColorComponent>
            <Row gutter={18}>
                <Col span={16}>
                    <button className='back-button' onClick={() => navigate(-1)}>
                        <LeftOutlined className='left-icon' />
                        QUAY LẠI
                    </button>
                    <Spin spinning={loading} tip="Đang tải dữ liệu...">
                    <div className="sec-box">
                        <div className="rc-infor__title">
                            <strong>Thông tin nhận hàng</strong>
                            {!userId 
                            ? 
                                <div>Bạn đã có tài khoản? 
                                <span onClick={showModal}>Đăng nhập ngay</span>
                                </div>
                            : 
                                ''
                            }
                        </div>
                        <div className="rc-infor__notice">
                            {!userId ? (
                                <>
                                    <p>*</p>
                                    <span onClick={showModal}>Đăng nhập</span>
                                    <p>để nhận được thông báo về tình trạng đơn hàng</p>
                                </>
                            ) : (
                                ''      
                            )}
                        </div>
                        {/* Form */}
                        <Form form={form} layout="vertical">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Họ tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    >
                                        <Input placeholder="Nhập họ tên của bạn" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item
                                        name="province"
                                        label="Tỉnh/Thành phố"
                                        rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}
                                    >
                                        <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleCityChange}>
                                        {cityData.map((city) => (
                                            <Option key={city.Id} value={city.Name}>
                                            {city.Name}
                                            </Option>
                                        ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="district"
                                        label="Quận/Huyện"
                                        rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện!' }]}
                                    >
                                        <Select 
                                            placeholder="Chọn Quận/Huyện" 
                                            onChange={handleDistrictChange} 
                                            disabled={!form.getFieldValue("province") || !districtData.length}
                                        >
                                        {districtData.map((district) => (
                                            <Option key={district.Id} value={district.Name}>
                                            {district.Name}
                                            </Option>
                                        ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="ward"
                                        label="Xã/Phường"
                                        rules={[{ required: true, message: 'Vui lòng chọn Xã/Phường!' }]}
                                    >
                                        <Select 
                                            placeholder="Chọn Xã/Phường" 
                                            disabled={!form.getFieldValue("district") || !wardData.length}
                                        >
                                        {wardData.map((ward) => (
                                            <Option key={ward.Id} value={ward.Name}>
                                            {ward.Name}
                                            </Option>
                                        ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        name="street"
                                        label="Số nhà, Tên đường"
                                        rules={[{ required: true, message: 'Vui lòng nhập số nhà và tên đường!' }]}
                                    >
                                        <Input placeholder="Nhập số nhà, tên đường" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="addressType"
                                        label="Loại địa chỉ"
                                        initialValue="house"
                                    >
                                        <Radio.Group>
                                            <Radio value="house">Nhà riêng</Radio>
                                            <Radio value="office">Văn phòng</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        {/* End Form */}
                    </div>
                    </Spin>
                    <div className="sec-box">
                        <div className="checkout__title">Giỏ hàng của bạn</div>
                        {selectedProducts && Array.isArray(selectedProducts) && selectedProducts.length > 0 ? (
                            selectedProducts.map((product, index) => (
                                <div key={product.id}>
                                    <div className="cart_checkout__product">
                                        <Image src={product.image} alt={product.name} width={85} height={85} />
                                        <div className="space-between__flex">
                                            <span className="cart_checkout__product-name">{product.name}</span>
                                            <div className="cart_checkout__price">
                                                <span className="cart_checkout__product-price">{product.price.toLocaleString('vi-VN')} ₫</span>
                                                <span>Số lượng: {product.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== selectedProducts.length - 1 && <div className='tier-line'></div>}
                                </div>
                            ))
                        ) : (
                            ''
                        )}
                        <Input.TextArea rows={2} placeholder="Nhập ghi chú của bạn tại đây" />
                    </div>
                    <div className="sec-box">
                        <div className="checkout__title">
                            Hình thức thanh toán
                        </div>
                        <Radio.Group onChange={handlePaymentChange} value={selectedPayment} className="payment-container">
                            <div className={`payment-option ${selectedPayment === 'cod' ? 'selected' : ''}`}>
                            <Radio value="cod" className="payment-radio">
                                <Image src={codImg} width={50} height={50} preview={false} />
                                <span className="payment-label">Thanh toán khi nhận hàng (COD)</span>
                            </Radio>
                            </div>
                            <div className={`payment-option ${selectedPayment === 'momo' ? 'selected' : ''}`}>
                            <Radio value="momo" className="payment-radio">
                                <Image src={momoImg} width={50} height={50} preview={false} />
                                <span className="payment-label">Ví điện tử MOMO</span>
                            </Radio>
                            </div>
                        </Radio.Group>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="sec-box">
                        <div className="discount-checkout">
                            <div className="checkout__title">Mã giảm giá</div>
                            <div className="discount-checkout__container">
                                <Input placeholder="Mã giảm giá đơn hàng"/>
                                <Button className="checkout__button">ÁP DỤNG</Button>
                            </div>
                            <div className="discount-checkout__list">
                                <span>Chọn mã giảm giá tại đây</span>
                            </div>
                            <div className="discount-checkout__container">
                                <Input placeholder="Mã giảm giá vận chuyển"/>
                                <Button className="checkout__button">ÁP DỤNG</Button>
                            </div>
                            <div className="discount-checkout__list">
                                <span>Chọn mã giảm giá tại đây</span>
                            </div>
                            <div className="discount-checkout__notice">
                                <span>** Mã giảm giá đơn hàng áp dụng cho giảm giá số tiền sản phẩm trong đơn.</span>
                                <span>** Mã giảm giá vận chuyển áp dụng cho giảm giá vận chuyển đơn hàng.</span>
                                <span>** Giá trị giảm giá nếu vượt quá giá trị đơn hàng 
                                    hoặc giá trị vận chuyển sẽ không trừ lẫn nhau.
                                </span>
                            </div>
                        </div>
                        <div className="sec-box">
                            <div className="order-infor">
                                <div className="checkout__title">Thông tin đơn hàng</div>
                                <div className="box-flex__between">
                                    <span>Tạm tính: </span>
                                    <span className="bold">{subtotal.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="box-flex__between">
                                    <span>Phí vận chuyển: </span>
                                    <span className="bold">{shippingFee.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="box-flex__between">
                                    <span>Giảm giá đơn hàng: </span>
                                    <span className="bold">- 0 ₫</span>
                                </div>
                                <div className="box-flex__between">
                                    <strong>Tổng cộng: </strong>
                                    <strong className="bold">{total.toLocaleString('vi-VN')} ₫</strong>
                                </div>
                            </div>
                            <Button className="checkout-order__button" onClick={handlePlaceOrder}>ĐẶT HÀNG</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <AuthModalComponent visible={isModalVisible} onCancel={handleCancel} />
        </WrapperBgColorComponent>
    )
}

export default CheckoutPage