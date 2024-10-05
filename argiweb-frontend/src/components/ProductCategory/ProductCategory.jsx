import React from 'react';
import { Menu, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ProductCategory.scss'

const ProductCategory = ({ types, onSelectType, selectedType  }) => {
  const navigate = useNavigate();

  return (
    <Card title="DANH MỤC SẢN PHẨM" style={{ width: 300 }}>
      <Menu
        mode="inline"
        style={{ height: '100%' }}
        selectedKeys={[selectedType]}
      >
        {types?.map((type, index) => (
          <Menu.Item 
            key={index} 
            onClick={() => {
              const originalType = type;
              const formatedType = type.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, '-')
              .toLowerCase();
              navigate(`/type/${formatedType}`);
              if (onSelectType) {
                onSelectType(originalType);
              }
              
            }}
            className={`menu-item ${selectedType === type ? 'selected' : ''}`}
          >
            {type.toUpperCase()}
          </Menu.Item>
        ))}
      </Menu>
    </Card>
  );
};

export default ProductCategory;
