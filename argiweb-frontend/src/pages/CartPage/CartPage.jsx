import React from 'react'
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import { Row, Col, List, Image } from 'antd'
import {LeftOutlined, CheckSquareOutlined, DeleteOutlined} from '@ant-design/icons'
import './CartPage.scss'
import { useSelector, useDispatch } from 'react-redux';
import QuantityInput from '../../components/QuantityInput/QuantityInput'
import { removeFromCart } from '../../redux/slides/cartSlide'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleToggleSelect = (id) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(id)) {
          newSelectedItems.delete(id);
        } else {
          newSelectedItems.add(id);
        }
        setSelectedItems(newSelectedItems);
    };

    const handleSelectAll = () => {
        if (cartItems.length === 0) {
            setSelectedItems(new Set());
        } else if (selectedItems.size === cartItems.length) {
          setSelectedItems(new Set());
        } else {
          const allIds = new Set(cartItems.map(item => item.id));
          setSelectedItems(allIds);
        }
    };

    const handleRemoveSelected = () => {
        const idsToRemove = Array.from(selectedItems);

        idsToRemove.forEach((id) => {
            dispatch(removeFromCart({ id }));
        });

        if (cartItems.length === idsToRemove.length) {
            setSelectedItems(new Set());
        } else {
            const updatedSelectedItems = new Set(selectedItems);
            idsToRemove.forEach(id => updatedSelectedItems.delete(id));
            setSelectedItems(updatedSelectedItems);
        }
    };

    return (
        <WrapperBgColorComponent>
            <Row>
                <Col span={18}>
                    <div className='container-left'>
                        <button className='back-button' onClick={() => navigate(-1)}>
                            <LeftOutlined />
                            TIẾP TỤC MUA SẮM
                        </button>
                        <div className='container-handle-many'>
                            <div className='select-all' onClick={handleSelectAll}>
                                <div className={`square-div ${selectedItems.size === cartItems.length ? 'selected' : ''}`}>
                                    {selectedItems.size === cartItems.length ? '✓' : ''}
                                </div>
                                Chọn tất cả sản phẩm
                            </div>
                            <div className='delete-all' onClick={handleRemoveSelected}>
                                <DeleteOutlined />
                                Xóa
                            </div>
                        </div>
                        <div className='tier-line'></div>
                        <div className='main-container'>
                            <List className='custom-list'>
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <List.Item key={item.id}>
                                            <div 
                                            className={`square-div ${selectedItems.has(item.id) ? 'selected' : ''}`} 
                                            onClick={() => handleToggleSelect(item.id)}>
                                                {selectedItems.has(item.id) ? '✓' : ''}
                                            </div>
                                            <Image src={item.image} alt={item.name} width={100} height={100} />
                                            <span className='name-item'>{item.name}</span>
                                            <div className='price-delete-div'>
                                                <span className='price-item'>{item.price.toLocaleString('vi-VN')} ₫</span>
                                                <DeleteOutlined className='delete-item' />
                                            </div>
                                            <QuantityInput 
                                                countInStock={item.countInStock} 
                                                initialQuantity={item.quantity} 
                                                itemId={item.id}
                                            />
                                        </List.Item>
                                    ))
                                ) : (
                                    ''
                                )}
                            </List>
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <h1>Hi</h1>
                </Col>
            </Row>
        </WrapperBgColorComponent>
    )
}

export default CartPage