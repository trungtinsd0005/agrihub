import { Card } from 'antd'
import './CardComponent.scss'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from '../StarRatingComponent/StarRating'

const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, label, selled, discount, id} = props
  const navigate = useNavigate();
  const handleNavigateProduct = () => {
    navigate(`/product/${id}`);
  }
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
    <p className='price-product'>{price.toLocaleString('vi-VN')} ₫</p>
  </Card>
  )
}

export default CardComponent