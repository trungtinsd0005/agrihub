import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Suggestion.scss'

const Suggestion = ({suggestions, onItemClick, onSearch}) => {

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
                            <div className="flex container-result-search">
                                <div className="container-product-search flex">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="product-search-img"
                                    />
                                    <div className="product-infor-search">
                                        <span>{item.name}</span>
                                        <span>{item.price} &#8363;</span>
                                    </div>
                                </div>
                                <div className="container-cart-icon">
                                    <ShoppingCartOutlined className="cart-icon-search" />
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