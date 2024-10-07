import { Card, message } from 'antd'
import {ShoppingCartOutlined, PlusOutlined} from '@ant-design/icons'
import './CardComponent.scss'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from '../StarRatingComponent/StarRating'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slides/cartSlide'

const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, label, selled, discount, id} = props
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigateProduct = () => {
    navigate(`/product/${id}`);
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const product = { id, name, price, image, countInStock };
    dispatch(addToCart(product));
    message.success(`${name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <Card
      hoverable
      className='card-container'
      cover={<img alt={name} src={image} />}
      onClick={handleNavigateProduct}
    >
    <h3 className='name-card'>{name}</h3>
    <div className='rating'>
      <StarRating rating={rating} />
      <span className='number-rating'>({rating || 0})</span>
    </div>
    <p className='sold-count'>Đã bán {selled || 1000}</p>
    <div className='price-cart'>
      <p className='price-product'>{price.toLocaleString('vi-VN')} ₫</p>
      <div className="custom-cart-icon" onClick={handleAddToCart}>
          <ShoppingCartOutlined className='cart-icon'/>
          <PlusOutlined className='plus-icon'  />
      </div>
    </div>
  </Card>
  )
}

export default CardComponent