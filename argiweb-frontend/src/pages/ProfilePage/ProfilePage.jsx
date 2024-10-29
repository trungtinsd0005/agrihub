import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import BreadcrumbComponent from '../../components/BreadcrumbComponent/BreadcrumbComponent'
import './ProfilePage.scss'
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, HeartOutlined, CommentOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { updateUser, getDetailUser } from '../../services/UserService';
import { getDetailOrder, cancelOrder, confirmOrderReceived } from '../../services/OrderService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, addToCart } from '../../redux/slides/cartSlide';


import {Row, Col, Form, Input, Radio, DatePicker, Button, message, Spin, Select, Tabs, Image, Modal} from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
const { Option } = Select;

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const details = await getDetailUser(userId);
          setUserData(details.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        console.error('User ID not found in localStorage');
      }
    };
    fetchUserDetails();

    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
        );
        setCityData(response.data);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };
    fetchCityData();

  }, [userId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: (data) => {
        message.success('User updated successfully');
        queryClient.invalidateQueries(['userDetails', userId]); 
        window.location.reload();
    },
    onError: (error) => {
      message.error('Failed to update user');
      console.error(error);
    }
  });

  const handleCityChange = (cityName) => {
    const selectedCity = cityData.find((city) => city.Name === cityName);
    if (selectedCity) {
      setDistrictData(selectedCity.Districts);
      setWardData([]);
    }
  };

  const handleDistrictChange = (districtName) => {
    const selectedDistrict = districtData.find((district) => district.Name === districtName);
    if (selectedDistrict) {
      setWardData(selectedDistrict.Wards);
    }
  };

  const handleSubmit = (values) => {
    const updatedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      address: {
        province: values.province,
        district: values.district,
        ward: values.ward,
        street: values.street,
      }
    };
    mutate(updatedData);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const result = await cancelOrder(orderId);
      alert(result.message || 'Đơn hàng đã được hủy');
    } catch (error) {
      alert('Lỗi khi hủy đơn hàng');
    }
  };

  const handleReview = (orderItem) => {
    if (orderItem.length === 1) {
      const item = orderItem[0];
      navigate(`/product/${item.id}`);
    } else {
      setSelectedProduct(orderItem);
      setIsModalVisible(true);
    }
  }

  const handleProductSelect = (productId) => {
    setIsModalVisible(false);
    navigate(`/product/${productId}`);
  }

  const renderReviewModal = () => (
    <Modal
      title="Chọn sản phẩm để đánh giá"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {selectedProduct && selectedProduct.map((item) => (
        <div key={item.id} className='container_choseReviewProduct'>
          <Button className='button_choseReviewProduct' onClick={() => handleProductSelect(item.id)}>
            <span>{item.name}</span>
          </Button>
        </div>
      ))}
    </Modal>
  );

  const handleConfirmReceived = async (orderId) => {
    try {
      const result = await confirmOrderReceived(orderId);
      alert(result.message || 'Đơn hàng đã được xác nhận nhận hàng thành công');
    } catch (error) {
      alert('Lỗi khi xác nhận đơn hàng');
    }
  };

  const handleRepurchase = (orderItems) => {
    orderItems.forEach(item => {
      const itemWithQuantity = { ...item };
      dispatch(addToCart(itemWithQuantity));
    });
    navigate('/cart');
  };
  

  const handleLogoutUser = () => {
    dispatch(clearCart());
    localStorage.removeItem('userId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('selectedProducts');
    navigate('/');
    window.location.reload();
  }

  const breadcrumbs = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tài khoản của tôi' },
  ];

  const [activeTab, setActiveTab] = useState('info');

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const orders = await getDetailOrder(userId);
          setOrderData(orders.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      } else {
        console.error('No userId found in localStorage');
      }
    };

    fetchOrderDetails();
  }, [orderData]);

  const renderContent = () => {
    if (!userData) {
      return <Spin tip="Đang tải thông tin..." />;
    }
    switch (activeTab) {
      case 'info':
        return (
          <Fragment>
            <div className='profile-title'>Thông tin tài khoản</div>
            <Form 
              onFinish={handleSubmit} 
              initialValues={{
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                street: userData.address?.street || '',
                province: userData.address?.province,
                district: userData.address?.district,
                ward: userData.address?.ward,
                gender: userData.gender,
                birthday: userData.birthday ? moment(userData.birthday, 'YYYY-MM-DD') : null,
              }}
              layout="horizontal" 
              labelCol={{ span: 5 }}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email người dùng!' }]}>
                <Input placeholder="Nhập email" disabled/>
              </Form.Item>
              <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
                <Input placeholder="Nhập tên người dùng" />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item label="Tỉnh/Thành phố" name="province" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}>
                <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleCityChange}>
                  {cityData.map((city) => (
                    <Option key={city.Id} value={city.Name}>
                      {city.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrictChange} disabled={!districtData.length}>
                  {districtData.map((district) => (
                    <Option key={district.Id} value={district.Name}>
                      {district.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Xã/Phường" name="ward" rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}>
                <Select placeholder="Chọn Xã/Phường" disabled={!wardData.length}>
                  {wardData.map((ward) => (
                    <Option key={ward.Id} value={ward.Name}>
                      {ward.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Số nhà, Tên đường" name="street" rules={[{ required: true, message: 'Vui lòng nhập số nhà và tên đường!' }]}>
                <Input placeholder="Nhập số nhà, tên đường" />
              </Form.Item>

              <Form.Item label="Giới tính" name="gender">
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Sinh nhật"
                name="birthday"
              >
                <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YY" />
              </Form.Item>
              <Button className='button-save' type="primary" htmlType="submit" loading={isLoading}>
                LƯU THAY ĐỔI
              </Button>
            </Form>
          </Fragment>
        );
      case 'orders':
        const filterOrdersByStatus = (status) => {
          if (status === 'all') {
              return orderData;
          }
          return orderData.filter((order) => order.status === status);
        };

        const getStatusLabel = (status) => {
          switch (status) {
            case 'pending':
              return 'Chờ xác nhận';
            case 'processing':
            return 'Đang xử lý';
            case 'shipped':
              return 'Đang giao hàng';
            case 'delivered':
              return 'Đã giao hàng';
            case 'completed':
              return 'Hoàn thành';
            case 'cancelled':
              return 'Đã hủy';
            default:
              return status;
          }
        };

        const renderOrderList = (orders) => {
          if (orders.length === 0) {
            return <p>Không có đơn hàng</p>;
          }
        
          return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => (
            <div className='order-box' key={item._id}>
              <div className='order__info-above'>
                <div className='order-id'>#{item._id.toUpperCase().slice(3, 4)}{item._id.toUpperCase().slice(-4)}</div>
                <div className='order-status'>{getStatusLabel(item.status)}</div>
              </div>
              {item.orderItems.map((orderItem) => (
                <div className='order-item' key={orderItem._id}>
                  <Image src={orderItem.image} alt={orderItem.name} height={80} width={80} />
                  <div className='product-name'>{orderItem.name}</div>
                  <div className='price-quantity__container'>
                    <div className='product-price'>{orderItem.price.toLocaleString('vi-VN')} ₫</div>
                    <div className='product-quantity'>x{orderItem.quantity || orderItem.amount}</div>
                  </div>
                </div>
              ))}
              <div className='tier-line__order'></div>
              <div className='order__info-below'>
                <div className='order-time'>
                  Đã đặt {" "}
                  {new Date(item.createdAt).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </div>
                <div className='order__total-price'>
                  Thành tiền: <span>{item.totalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
                {item.isDelivered && 
                <div className='order-time__container'>
                  <div>
                    Đã giao {new Date(item.deliveredAt).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                  </div>
                </div>
                }
              <div className={`button-order-container ${item.isDelivered ? 'has-message' : ''}`}>
                {item.isDelivered && <p>Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.</p>}
                {item.status === 'pending' && (
                  <Button className='custom-button__Order' onClick={() => handleCancelOrder(item._id)}>Hủy Đơn Hàng</Button>
                )}
                {item.status === 'delivered' && (
                  <Button className='custom-button__Order' onClick={() => handleConfirmReceived(item._id)}>Đã nhận được hàng</Button>
                )}
                {item.status === 'cancelled' ? (
                  <Button className='custom-button__Order' onClick={() => handleRepurchase(item.orderItems)}>Mua lại</Button>
                ) : item.status === 'completed' ? (
                  <div>
                    <Button className='custom-button__Order primary-color' onClick={() => handleReview(item.orderItems)}>Đánh giá</Button>
                    <Button className='custom-button__Order' onClick={() => handleRepurchase(item.orderItems)}>Mua lại</Button>
                  </div>
                ) : null}
              </div>
            </div>
          ));
        };

        return (
          <Tabs defaultActiveKey="1">
            {['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Chờ giao hàng', 'Đã giao hàng', 'Hoàn thành', 'Đã hủy'].map((label, index) => {
              const statusKeys = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
              return (
                <TabPane tab={label} key={index + 1}>
                  {renderOrderList(filterOrdersByStatus(statusKeys[index]))}
                </TabPane>
              );
            })}
          </Tabs>
        );
      case 'vouchers':
        return <div>Voucher của tôi</div>;
      case 'favorites':
        return <div>Sản phẩm yêu thích</div>;
      case 'reviews':
        return <div>Nhận xét của tôi</div>;
      case 'notifications':
        return <div>Thông báo của tôi</div>;
      default:
        return null;
    }
  };

  return (
    <WrapperBgColorComponent>
      <BreadcrumbComponent breadcrumbs={breadcrumbs}/>
      <div className='container'>
        <Row>
          <Col span={8}>
            <div className='widget mr20'>
              <div className='uname'>
                <span className='t1 medium'>Tài khoản</span>
                <span className='t2 semi-bold'>{userData?.name}</span>
                <span className='t1'>{userData?.email}</span>
              </div>
              <div className="menu-account">
                <div onClick={() => setActiveTab('info')} className={activeTab === 'info' ? 'active-tab' : ''}>
                  <UserOutlined /> Thông tin của tôi
                </div>
                <div onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active-tab' : ''}><ShoppingCartOutlined /> Đơn hàng của tôi</div>
                <div onClick={() => setActiveTab('vouchers')} className={activeTab === 'vouchers' ? 'active-tab' : ''}><DollarOutlined /> Voucher của tôi</div>
                <div onClick={() => setActiveTab('favorites')} className={activeTab === 'favorites' ? 'active-tab' : ''}><HeartOutlined /> Sản phẩm yêu thích</div>
                <div onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? 'active-tab' : ''}><CommentOutlined /> Nhận xét của tôi</div>
                <div onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'active-tab' : ''}><BellOutlined /> Thông báo của tôi</div>
                <div><a href='/' onClick={handleLogoutUser}><LogoutOutlined /> Đăng xuất</a></div>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className='widget'>
              {renderContent()}
              {renderReviewModal()}
            </div>
          </Col>
        </Row>
      </div>
    </WrapperBgColorComponent>
  )
}

export default ProfilePage