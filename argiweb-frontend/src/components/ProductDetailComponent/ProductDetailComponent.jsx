import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Spin,
  message,
  List,
  Progress,
  Button,
  Form,
  Rate,
} from "antd";
import { LeftOutlined, StarFilled } from "@ant-design/icons";
import "./ProductDetailComponent.scss";
import QuantityInput from "../QuantityInput/QuantityInput";
import NavButtonComponent from "../NavButtonComponent/NavButtonComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import {
  getDetailProduct,
  createProductReview,
  getProductByType,
} from "../../services/ProductService";
import StarRating from "../StarRatingComponent/StarRating";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slides/cartSlide";
import TextArea from "antd/es/input/TextArea";
import CardComponent from "../CardComponent/CardComponent";

const ProductDetailComponent = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [typeProduct, setTypeProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cityData, setCityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getDetailProduct(id);
        const response = await getProductByType(res.data.type);
        setProduct(res.data);
        setTypeProduct(response);
        setMainImage(res.data.image);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  console.log("Type", typeProduct);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCityData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  const submitReview = async () => {
    const userName = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      message.error("Vui lòng đăng nhập trước khi đánh giá sản phẩm");
      return;
    }
    if (reviewRating === 0) {
      message.error("Vui lòng chọn số sao để đánh giá!");
      return;
    }

    if (!reviewComment.trim()) {
      message.error("Vui lòng nhập bình luận!");
      return;
    }

    try {
      await createProductReview(id, {
        userId: userId,
        userName: userName,
        rating: reviewRating,
        comment: reviewComment,
      });
      message.success("Review submitted");
      setReviewRating(0);
      setReviewComment("");
      const productData = await getDetailProduct(id);
      setProduct(productData.data);
    } catch (error) {
      message.error(error.response?.data?.message || "Error submitting review");
    }
    setReviewFormVisible(false);
  };

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
    return <Spin tip="Đang tải dữ liệu" />;
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

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleBuyNow = () => {
    const selectedProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      countInStock: product.countInStock,
      quantity: quantity,
    };

    localStorage.setItem("selectedProducts", JSON.stringify([selectedProduct]));

    if (quantity > 0) {
      navigate("/checkout");
    } else {
      alert("Vui lòng chọn số lượng sản phẩm trước khi tiến hành thanh toán");
    }
  };

  const ratingsCount = product
    ? {
        5: product.reviews.filter((review) => review.rating === 5).length,
        4: product.reviews.filter((review) => review.rating === 4).length,
        3: product.reviews.filter((review) => review.rating === 3).length,
        2: product.reviews.filter((review) => review.rating === 2).length,
        1: product.reviews.filter((review) => review.rating === 1).length,
      }
    : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <>
      <Row className="mainContainer">
        <Col span={8}>
          <Image
            src={mainImage}
            width={400}
            height={400}
            alt={`${product.name} Image Large`}
            preview={false}
          />
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="imageContainer">
              <NavButtonComponent direction="prev" onClick={handlePrev} />
              {product.additionalImages
                .slice(currentIndex, currentIndex + 4)
                .map((img, index) => (
                  <Image
                    className="addImages"
                    src={img}
                    alt={`Image small ${index + 1}`}
                    onClick={() => handleImageClick(img)}
                    preview={false}
                    key={index}
                  />
                ))}
              <NavButtonComponent direction="next" onClick={handleNext} />
            </div>
          )}
        </Col>
        <Col span={10} className="paddingSides">
          <div className="infoDetail">
            <div className="titleProduct">{product.name}</div>
            <div className="divInline">
              <StarRating rating={product.rating} />
              <div className="ratingReview"> {product.numReviews} đánh giá</div>
              <div className="countSold">{product.selled} đã bán</div>
            </div>
            <div className="priceProducts">
              <strong>{product.price.toLocaleString("vi-VN")} ₫</strong>
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
                      {selectedDistrict
                        ? `${selectedCity} - ${selectedDistrict}`
                        : selectedCity || "Chọn Tỉnh / Thành phố"}
                    </div>
                    {isDropdownOpen && (
                      <ul className="dropdownList">
                        {selectedCity && (
                          <div className="customDiv" onClick={resetSelection}>
                            <LeftOutlined /> {selectedCity}
                          </div>
                        )}
                        {selectedCity
                          ? districtData.map((district) => (
                              <li
                                key={district.Name}
                                onClick={() =>
                                  handleOptionChange(district.Name)
                                }
                              >
                                {`${selectedCity} - ${district.Name}`}
                              </li>
                            ))
                          : cityData.map((city) => (
                              <li
                                key={city.Name}
                                onClick={() => handleOptionChange(city.Name)}
                              >
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
              <QuantityInput
                countInStock={product.countInStock}
                initialQuantity={1}
                onQuantityChange={setQuantity}
              />
            </div>
            <div className="buttonSection">
              <ButtonComponent
                label={"THÊM VÀO GIỎ HÀNG"}
                className="buttonAddToCart"
                onClick={() => handleAddToCart(product, quantity)}
              />
              <ButtonComponent
                label={"MUA NGAY"}
                className="buttonBuyNow"
                onClick={handleBuyNow}
              />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="rightInfo">
            <p className="moreInfoTag">Thông tin thêm:</p>
            <div className="tierPrice"></div>
            <div>
              <p className="contactUsTitle">
                Mua sỉ vui lòng liên hệ chúng tôi:
              </p>
              <div className="contactWrapper">
                <a className="contactUsBtn" href="tel:+84833577005">
                  0833 577 005
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="contactByMess"
                >
                  Gửi tin nhắn
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mainContainer">
        <div className="box-tag">
          <div className="tag">Thông tin sản phẩm</div>
        </div>
        <div className="tier"></div>
        <Col span={14}>
          <div className="description-products__left">
            {product.description
              .trim()
              .split(".")
              .filter((item) => item.trim() !== "")
              .map((sentence, index) => (
                <li key={index}>{sentence.trim()}.</li>
              ))}
          </div>
          <Image
            src={
              product.additionalImages && product.additionalImages.length > 1
                ? product.additionalImages[product.additionalImages.length - 2]
                : product.image
            }
            style={{ width: "100%", height: "100%" }}
          />
        </Col>
        <Col span={10}>
          <div className="ml-20 mt-20">
            <Row className="box-description">
              <Col span={12} className="description-title">
                Mã sản phẩm:
              </Col>
              <Col span={12} className="description-content">
                {product._id}
              </Col>
            </Row>
            <Row className="box-description">
              <Col span={12} className="description-title">
                Xuất xứ:
              </Col>
              <Col span={12} className="description-content">
                {product.origin}
              </Col>
            </Row>
            <Row className="box-description">
              <Col span={12} className="description-title">
                Thành phần:
              </Col>
              <Col span={12} className="description-content">
                {product.ingredients && product.ingredients.trim() !== ""
                  ? product.ingredients
                      .trim()
                      .split(".")
                      .filter((item) => item.trim() !== "")
                      .map((sentence, index) => (
                        <div key={index}>- {sentence.trim()}.</div>
                      ))
                  : null}
              </Col>
            </Row>
            <Row className="box-description">
              <Col span={12} className="description-title">
                Hướng dẫn sử dụng:
              </Col>
              <Col span={12} className="description-content">
                {product.usageInstructions &&
                product.usageInstructions.trim() !== ""
                  ? product.usageInstructions
                      .trim()
                      .split(".")
                      .filter((item) => item.trim() !== "")
                      .map((sentence, index) => (
                        <div key={index}>{sentence.trim()}.</div>
                      ))
                  : null}
              </Col>
            </Row>
            <Row className="box-description">
              <Col span={12} className="description-title">
                Hướng dẫn bảo quản:
              </Col>
              <Col span={12} className="description-content">
                {product.storageInstructions
                  ? product.storageInstructions
                  : null}
              </Col>
            </Row>
            <Row className="box-description">
              <Col span={12} className="description-title">
                Trọng lượng:
              </Col>
              <Col span={12} className="description-content">
                {product.storageInstructions
                  ? product.storageInstructions
                  : null}
              </Col>
            </Row>
            {product.productionDate ? (
              <Row className="box-description">
                <Col span={12} className="description-title">
                  Ngày sản xuất:
                </Col>
                <Col span={12} className="description-content">
                  {product.productionDate}
                </Col>
              </Row>
            ) : (
              ""
            )}
            {product.productionDate ? (
              <Row className="box-description">
                <Col span={12} className="description-title">
                  Hạn sử dụng:
                </Col>
                <Col span={12} className="description-content">
                  {product.expirationDate}
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>

      <div className="mainContainer half-width">
        <div className="review-title">Đánh giá sản phẩm</div>
        <div className="box-border">
          <Row>
            <Col span={5} className="form-review">
              <div className="total-rating">
                {product.rating.toFixed(1)} <StarFilled />
              </div>
            </Col>
            <Col span={12} className="col-review__productDetail">
              <List
                itemLayout="horizontal"
                dataSource={[5, 4, 3, 2, 1]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div className="container-list__review">
                          <span>
                            {item} <StarFilled style={{ color: "#fd9727" }} />
                          </span>
                          <Progress
                            style={{ marginLeft: "10px", width: "60%" }}
                            percent={
                              (ratingsCount[item] / product.numReviews) * 100 ||
                              0
                            }
                            strokeColor="#f25800"
                            showInfo={false}
                          />
                          <span style={{ marginLeft: "10px" }}>
                            {ratingsCount[item]} đánh giá
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col
              span={7}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Button
                type="primary"
                className="button-review"
                onClick={() => setReviewFormVisible(!isReviewFormVisible)}
                style={{
                  backgroundColor: isReviewFormVisible ? "white" : "#0A923C",
                  color: isReviewFormVisible ? "#0A923C" : "white",
                  border: "1px solid #0A923C",
                  boxShadow: "none",
                }}
              >
                Gửi đánh giá của bạn
              </Button>
            </Col>
          </Row>
          <Form layout="vertical" onFinish={submitReview}>
            {isReviewFormVisible ? (
              <Row style={{ height: "max-content" }}>
                <Col span={24} style={{ height: "35px" }}>
                  <Form.Item required>
                    <Rate
                      onChange={(value) => setReviewRating(value)}
                      value={reviewRating}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {reviewRating > 0 && (
                    <Form.Item>
                      <TextArea
                        rows={4}
                        onChange={(e) => setReviewComment(e.target.value)}
                        value={reviewComment}
                        placeholder="Nhập bình luận"
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col span={10} style={{ marginLeft: "30px" }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="custom-button__review"
                    >
                      Gửi đánh giá
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
          </Form>
        </div>
        {product.reviews.map((review) => (
          <div className="review-details">
            <div className="username__review">{review.name}</div>
            <StarRating rating={review.rating} />
            <div className="reviews-date">
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div>{review.comment}</div>
          </div>
        ))}
      </div>

      <div className="main-container__home">
        <div className="menu-render-products__normal">
          <span className={"span-render-products__normal"}>
            Sản phẩm cùng loại
          </span>
        </div>
        <div className="product-slider-container">
          <NavButtonComponent direction="prev" onClick={handlePrev} />
          <div className="products-container__notNav">
            {typeProduct?.data.length > 0 ? (
              typeProduct?.data.map((product) => (
                <div className="product-item" key={product._id}>
                  <CardComponent
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    numReviews={product.numReviews}
                    salesHistory={product.salesHistory}
                    id={product._id}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))
            ) : (
              <div className="no-products">Không có sản phẩm phù hợp</div>
            )}
          </div>
          <NavButtonComponent direction="next" onClick={handleNext} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailComponent;
