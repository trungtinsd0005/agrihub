import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Row, Col, Image, Spin, message} from 'antd';
import {LeftOutlined} from '@ant-design/icons'
import './ProductDetailComponent.scss'
import QuantityInput from '../QuantityInput/QuantityInput';
import NavButtonComponent from '../NavButtonComponent/NavButtonComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { getDetailProduct } from '../../services/ProductService';
import StarRating from '../StarRatingComponent/StarRating';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slides/cartSlide'

const ProductDetailComponent = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cityData, setCityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getDetailProduct(id)
        setProduct(res.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
        setCityData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching city data:', error);
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOptionChange = (value) => {
    if (!selectedCity) {
      setSelectedCity(value);
      const selectedCityData = cityData.find((city) => city.Name === value);
      if (selectedCityData) {
        setDistrictData(selectedCityData.Districts);
        setDropdownOpen(true);
      }
    } else {
      setSelectedDistrict(value);
      setDropdownOpen(false);
    }
  };
  
  const resetSelection = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    setDistrictData([]);
  };

  const handleAddToCart = (product) => {
    if (!product || !product._id) {
      message.error("Sản phẩm không hợp lệ!");
      return;
    }

    if (quantity > product.countInStock) {
      message.error("Số lượng yêu cầu vượt quá số lượng có sẵn!");
      return;
    }

    const { _id: id, name, price, image, countInStock } = product;
    const item = { id, name, price, image, countInStock, quantity };
    
    dispatch(addToCart(item));
    
    message.success(`${name} đã được thêm vào giỏ hàng!`);
  };

  if (!product) {
    return <Spin tip="Đang tải dữ liệu"/>
  }

  const handleNext = () => {
    if (currentIndex < product.additionalImages.length - 4) {
        setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
      if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
      }
  };

  return (
    <Row className="mainContainer">
            <Col span={8}>
                <Image src={product.image} width={400} height={400} alt={`${product.name} Image Large`} preview={false} />
                <div className="imageContainer">
                  <NavButtonComponent direction="prev" onClick={handlePrev}/>
                  {product.additionalImages
                    .slice(currentIndex, currentIndex + 4)
                    .map((img, index) => (
                      <Image className="addImages" src={img} alt={`Image small ${index + 1}`} preview={false} key={index} />
                  ))}
                  <NavButtonComponent direction="next" onClick={handleNext}/>
                </div>
            </Col>
            <Col span={10} className="paddingSides">
                <div className="infoDetail">
                  <div className="titleProduct">
                    {product.name}
                  </div>
                  <div className="divInline">
                    <StarRating rating={product.rating}/>
                    <div className="ratingReview"> 0 đánh giá</div>
                    <div className="countSold">{product.selled} đã bán</div>
                  </div>
                  <div className="priceProducts">
                    <strong>{product.price.toLocaleString('vi-VN')} ₫</strong>
                  </div>
                  <div className="tierPrice"></div>
                  <Row>
                    <Col span={7}>
                      <div className="title">Vận chuyển đến:</div>
                      <div className="title">Phí vận chuyển:</div>
                    </Col>
                    <Col span={17}>
                      <div className="item">
                        <div className="deliverySelect">
                          <div className="customSelect" onClick={toggleDropdown}>
                              {selectedDistrict ? `${selectedCity} - ${selectedDistrict}` : selectedCity || "Chọn Tỉnh / Thành phố"}
                          </div>
                          {isDropdownOpen && (
                            <ul className="dropdownList">
                              {selectedCity && (
                                <div className="customDiv" onClick={resetSelection}>
                                  <LeftOutlined /> {selectedCity}
                                </div>
                              )}
                              {selectedCity
                                ?
                                  districtData.map((district) => (
                                    <li key={district.Name} onClick={() => handleOptionChange(district.Name)}>
                                      {`${selectedCity} - ${district.Name}`}
                                    </li>
                                  ))
                                : cityData.map((city) => (
                                  <li key={city.Name} onClick={() => handleOptionChange(city.Name)}>
                                    {city.Name}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="item">
                        <div className="deliveryPrice">
                          <span>40.000 ₫</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="quantityContainer">
                    <div className="title">Số lượng:</div>
                    <span>Chỉ còn {product.countInStock} sản phẩm;</span>
                    <QuantityInput countInStock={product.countInStock} initialQuantity={1} onQuantityChange={setQuantity} />
                  </div>
                  <div className="buttonSection">
                    <ButtonComponent label={"THÊM VÀO GIỎ HÀNG"} className="buttonAddToCart" onClick={() => handleAddToCart(product, quantity)} />
                    <ButtonComponent label={"MUA NGAY"} className="buttonBuyNow" />
                  </div>
                </div>
            </Col>
            <Col span={6}>
                <div className="rightInfo">
                  <p className="moreInfoTag">
                    Thông tin thêm:
                  </p>
                  <div className="tierPrice"></div>
                  <div>
                    <p className="contactUsTitle">Mua sỉ vui lòng liên hệ chúng tôi:</p>
                    <div className="contactWrapper">
                      <a className="contactUsBtn" href='tel:+84833577005'>0833 577 005</a>
                      <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="contactByMess">Gửi tin nhắn</a>
                    </div>
                  </div>
                </div>
            </Col>
    </Row>
  )
}

export default ProductDetailComponent