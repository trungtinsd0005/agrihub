import React from 'react'
import { Button } from 'antd';

const ButtonComponent = ({ label, className }) => {
  return (
    <Button className={className}>
      {label}
    </Button>
  );
};

export default ButtonComponent