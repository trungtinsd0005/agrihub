import React, { useState, useEffect } from 'react';
import { InputNumber, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '../../redux/slides/cartSlide';

const QuantityInput = ({ countInStock, initialQuantity, itemId }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const increment = () => {
    if (quantity < countInStock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleChange = (value) => {
    setQuantity(value);
    dispatch(updateQuantity({ id: itemId, quantity: value }));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button 
        onClick={decrement} 
        style={{ 
            marginRight: 8, 
            height: '45px',
            backgroundColor: quantity === 1 ? '#ccc' : '',
            borderColor: quantity === 1 ? '#ccc' : '',
            fontSize: '25px',
            paddingBottom: '25px'
        }} 
        disabled={quantity === 1}>_</Button>
      <InputNumber
        min={1}
        value={quantity}
        controls={false}
        onChange={handleChange}
        style={{ width: '100px', textAlign: 'center', height: '45px', paddingLeft: '30px', lineHeight: '40px', fontSize: '16px' }}
      />
      <Button 
        onClick={increment} 
        style={{
            marginLeft: '8px',
            height: '45px',
            fontSize: '20px',
            transition: 'background-color 0.3s, color 0.3s'
        }}
        disabled={quantity >= countInStock}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityInput;
