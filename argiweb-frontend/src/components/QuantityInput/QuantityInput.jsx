import React, { useState } from 'react';
import { InputNumber, Button } from 'antd';

const QuantityInput = ({ countInStock }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if(quantity < countInStock){
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
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
        onChange={setQuantity}
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
