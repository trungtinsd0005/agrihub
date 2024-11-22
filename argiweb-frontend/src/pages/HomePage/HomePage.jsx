import { React, useEffect, useState } from "react";
import ProductCategory from "../../components/ProductCategory/ProductCategory";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import "./HomePage.scss";
import CardComponent from "../../components/CardComponent/CardComponent";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import NavButtonComponent from "../../components/NavButtonComponent/NavButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slides/cartSlide";
import dayjs from "dayjs";
import imgSlider1 from "../../assets/images/imageSlider1.png";
import imgSlider2 from "../../assets/images/imageSlider2.png";
import Chatbot from "../../components/ChatBot/ChatBot";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [filterType, setFilterType] = useState("new");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendFilterType, setRecommendFilterType] = useState("highRated");
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const productWithQuantity = {
      ...product,
      quantity: 1,
    };
    dispatch(addToCart(productWithQuantity));
  };

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllType();
    return res;
  };

  const fetchTypeProduct = async (type) => {
    const res = await ProductService.getProductByType(type);
    return res;
  };

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: types } = useQuery({
    queryKey: ["types"],
    queryFn: fetchAllTypeProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: typeDT } = useQuery({
    queryKey: ["type", "Đất trồng"],
    queryFn: () => fetchTypeProduct("Đất trồng"),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: typePHC } = useQuery({
    queryKey: ["type", "Phân hữu cơ"],
    queryFn: () => fetchTypeProduct("Phân hữu cơ"),
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (products?.data) {
      let newFilteredProducts = [];

      if (filterType === "new") {
        newFilteredProducts = products.data.filter((product) => {
          const productDate = dayjs(product.createdAt);
          const today = dayjs();
          return productDate.isAfter(today.subtract(7, "days"));
        });
      } else if (filterType === "bestSeller") {
        const salesThreshold = 1;
        const salesWindowDays = 30;
        const today = dayjs();

        newFilteredProducts = products.data.filter((product) => {
          const salesInLast30Days = product.salesHistory
            .filter(
              (sale) => today.diff(dayjs(sale.month), "days") <= salesWindowDays
            )
            .reduce((total, sale) => total + sale.totalCount, 0);
          return salesInLast30Days >= salesThreshold;
        });

        newFilteredProducts.sort((a, b) => {
          const salesA = a.salesHistory
            .filter(
              (sale) => today.diff(dayjs(sale.month), "days") <= salesWindowDays
            )
            .reduce((total, sale) => total + sale.totalCount, 0);
          const salesB = b.salesHistory
            .filter(
              (sale) => today.diff(dayjs(sale.month), "days") <= salesWindowDays
            )
            .reduce((total, sale) => total + sale.totalCount, 0);
          return salesB - salesA;
        });

        newFilteredProducts = newFilteredProducts.slice(0, 12);
      }
      setFilteredProducts(newFilteredProducts);

      if (recommendFilterType === "highRated") {
        const ratedProducts = products.data.filter(
          (product) => product.rating >= 4.5
        );
        setRecommendedProducts(ratedProducts);
      } else if (recommendFilterType === "mustHave") {
        const mustHaveProductsList = products.data.filter(
          (product) => product.selled > 10
        );
        setRecommendedProducts(mustHaveProductsList);
      }
    }
  }, [filterType, products, recommendFilterType]);

  const handleNext = () => {
    if (currentIndex < filteredProducts.length - 6) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nameTypeDT = "ĐẤT TRỒNG SIÊU SẠCH";
  const nameTypePHC = "PHÂN HỮU CƠ";
  const formattedType = nameTypeDT.split(" ").slice(0, 2).join(" ");

  return (
    <WrapperBgColorComponent>
      <div className="feature-area">
        <div className="productCateory">
          <ProductCategory types={types?.data} />
        </div>
        <div className="slider">
          <SliderComponent />
        </div>
        <div className="image-column">
          <div className="img__slider-container">
            <img src={imgSlider1} alt="Hình slide 1" className="column-img" />
            <img src={imgSlider2} alt="Hình slide 2" className="column-img" />
          </div>
        </div>
      </div>
      <div className="main-container__home">
        <div className="menu-render-products">
          <span
            className={`span-render-products ${
              filterType === "new" ? "active" : ""
            }`}
            onClick={() => setFilterType("new")}
          >
            SẢN PHẨM MỚI
          </span>
          <span
            className={`span-render-products ${
              filterType === "bestSeller" ? "active" : ""
            }`}
            onClick={() => setFilterType("bestSeller")}
          >
            BÁN CHẠY NHẤT
          </span>
        </div>
        <div className="product-slider-container">
          <NavButtonComponent direction="prev" onClick={handlePrev} />
          <div className="products-container">
            {filteredProducts.length > 0 ? (
              filteredProducts
                .slice(currentIndex, currentIndex + 6)
                .map((product) => (
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
      <div className="main-container__home">
        <div className="menu-render-products__normal">
          <span
            className={"span-render-products__normal"}
            onClick={() => {
              const formatedType = formattedType
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase();
              navigate(`/type/${formatedType}`);
            }}
          >
            {nameTypeDT}
          </span>
          <span
            className={"span-render-products__seeAll"}
            onClick={() => {
              const formatedType = formattedType
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase();
              navigate(`/type/${formatedType}`);
            }}
          >
            Xem tất cả &gt;
          </span>
        </div>
        <div className="product-slider-container">
          <div className="products-container__notNav">
            {typeDT?.data.length > 0 ? (
              typeDT?.data.map((product) => (
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
        </div>
      </div>
      <div className="main-container__home">
        <div className="menu-render-products">
          <span
            className={`span-render-products ${
              recommendFilterType === "highRated" ? "active" : ""
            }`}
            onClick={() => setRecommendFilterType("highRated")}
          >
            ĐƯỢC ĐÁNH GIÁ CAO
          </span>
          <span
            className={`span-render-products ${
              recommendFilterType === "mustHave" ? "active" : ""
            }`}
            onClick={() => setRecommendFilterType("mustHave")}
          >
            KHÔNG THỂ BỎ LỠ
          </span>
        </div>
        <div className="product-slider-container">
          <NavButtonComponent direction="prev" onClick={handlePrev} />
          <div className="products-container">
            {recommendedProducts.length > 0 ? (
              recommendedProducts
                .slice(currentIndex, currentIndex + 6)
                .map((product) => (
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
      <div className="main-container__home">
        <div className="menu-render-products__normal">
          <span
            className={"span-render-products__normal"}
            onClick={() => {
              const formatedType = formattedType
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase();
              navigate(`/type/${formatedType}`);
            }}
          >
            {nameTypePHC}
          </span>
          <span
            className={"span-render-products__seeAll"}
            onClick={() => {
              const formatedType = nameTypePHC
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase();
              navigate(`/type/${formatedType}`);
            }}
          >
            Xem tất cả &gt;
          </span>
        </div>
        <div className="product-slider-container">
          <div className="products-container__notNav">
            {typePHC?.data.length > 0 ? (
              typePHC?.data.map((product) => (
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
        </div>
      </div>
      <Chatbot />
    </WrapperBgColorComponent>
  );
};

export default HomePage;
