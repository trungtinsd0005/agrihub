import React from 'react';
import './NavButtonComponent.scss';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

const NavButtonComponent = ({ direction, onClick }) => {
  return (
    <button
      className={`nav-button ${direction}`}
      onClick={onClick}
    >
      {direction === 'prev' ? <LeftOutlined /> : <RightOutlined />}
    </button>
  );
};

export default NavButtonComponent;