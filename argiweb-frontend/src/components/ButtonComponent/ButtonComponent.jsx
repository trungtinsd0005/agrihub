import React from 'react'
import { Button } from 'antd';

const ButtonComponent = ({ label, className, onClick }) => {
  return (
    <Button className={className} onClick={onClick}>
      {label}
    </Button>
  );
};

export default ButtonComponent