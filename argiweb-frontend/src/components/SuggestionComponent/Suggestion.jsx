import React from 'react'
import { ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slides/cartSlide';
import { message } from 'antd';
import './Suggestion.scss'

const Suggestion = ({suggestions, onItemClick, onSearch}) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        const { _id: id, name, price, image, countInStock } = item;
        const product = { id, name, price, image, countInStock };
        dispatch(addToCart(product));
        message.success(`${name} đã được thêm vào giỏ hàng!`);
    };

    return (
        <div className="suggestion-container">
          {suggestions.length > 0 ? (
            <>
                <div className="suggestion-list">
                    {suggestions.map((item) => (
                        <div
                        key={item._id}
                        className="suggestion-item"
                        onClick={() => onItemClick(item._id)}
                        >
                            <div className="container-result-search">
                                <div className="img-div">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="product-search-img"
                                    />
                                </div>
                                <div className='product-info-container'>
                                    <div className="name-div">
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="price-cart-div">
                                        <span className='price-span'>{item.price.toLocaleString('vi-VN')} &#8363;</span>
                                        <div className="container-cart-icon" onClick={(e) => handleAddToCart(e, item)}>
                                            <ShoppingCartOutlined className="cart-icon-search" />
                                            <PlusOutlined className="plus-icon-search" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='see-more' onClick={onSearch}>Xem tất cả &gt;&gt;</div>
            </>
          ) : (
            <div className="no-result">Không tìm thấy sản phẩm phù hợp</div>
          )}
        </div>
    );
};

export default Suggestion;