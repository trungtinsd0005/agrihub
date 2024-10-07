import { React, useEffect, useState} from "react";
import ProductCategory from "../../components/ProductCategory/ProductCategory";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import './HomePage.scss';
import CardComponent from "../../components/CardComponent/CardComponent";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import NavButtonComponent from "../../components/NavButtonComponent/NavButtonComponent";
import * as ProductService from '../../services/ProductService'
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from 'react-redux';
import { addToCart } from "../../redux/slides/cartSlide";
import dayjs from 'dayjs';

const HomePage = () => {
    const [filterType, setFilterType] = useState('new');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const fetchProductAll = async() => {
        const res = await ProductService.getAllProduct()
        return res;
    }

    const fetchAllTypeProduct = async() => {
        const res = await ProductService.getAllType()
        console.log(res.data);
        return res;
    }

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    })

    const { data: types } = useQuery({
        queryKey: ['types'],
        queryFn: fetchAllTypeProduct,
        retry: 3,
        retryDelay: 1000
    });

    useEffect(() => {
        if (products?.data) {
            let newFilteredProducts = [];

            if (filterType === 'new') {
                newFilteredProducts = products.data.filter(product => {
                    const productDate = dayjs(product.createdAt);
                    const today = dayjs();
                    return productDate.isAfter(today.subtract(7, 'days'));
                });
            } else if (filterType === 'bestSeller') {
                newFilteredProducts = products.data.filter(product => product.selled >= 10);
            }
            setFilteredProducts(newFilteredProducts);
        }
    }, [filterType, products]);

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

    return (
        <WrapperBgColorComponent>
            <div className="feature-area">
                <div className="productCateory">
                    <ProductCategory types={types?.data} />
                </div>
                <div className="slider">
                    <SliderComponent />
                </div>
            </div>
            <div className="main-container">
                <div className="menu-render-products">
                <span
                    className={`span-render-products ${filterType === 'new' ? 'active' : ''}`}
                    onClick={() => setFilterType('new')}
                >
                    SẢN PHẨM MỚI
                </span>
                <span
                    className={`span-render-products ${filterType === 'bestSeller' ? 'active' : ''}`}
                    onClick={() => setFilterType('bestSeller')}
                >
                    BÁN CHẠY NHẤT
                </span>
                </div>
                <div className="product-slider-container">
                    <NavButtonComponent direction="prev" onClick={handlePrev}/>
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
                                        id={product._id}
                                        onAddToCart={() => handleAddToCart(product)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="no-products">Không có sản phẩm phù hợp</div>
                        )}
                    </div>
                    <NavButtonComponent direction="next" onClick={handleNext}/>
                </div>
            </div>
        </WrapperBgColorComponent>
    )
}

export default HomePage