import React from 'react'
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import { Row, Col, List, Image, message } from 'antd'
import {LeftOutlined, DeleteOutlined, RightOutlined} from '@ant-design/icons'
import './CartPage.scss'
import { useSelector, useDispatch } from 'react-redux';
import QuantityInput from '../../components/QuantityInput/QuantityInput'
import { removeFromCart, updateQuantity } from '../../redux/slides/cartSlide'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const totalSelectedPrice = Array.from(selectedItems)
        .map(id => cartItems.find(item => item.id === id))
        .reduce((total, item) => item ? total + item.price * item.quantity : total, 0);

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

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart({ id }));
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

    const handleQuantityChange = (id, newQuantity) => {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    const handleCheckout = () => {
        const selectedProducts = cartItems.filter(item => selectedItems.has(item.id));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        if(selectedProducts.length > 0) {
            navigate('/checkout');
        } else {
            alert("Vui lòng chọn sản phẩm trước khi tiến hành thanh toán");
        }
    };
    return (
        <WrapperBgColorComponent>
            <Row>
                <Col span={18}>
                    <div className='container-left'>
                        <button className='back-button' onClick={() => navigate(-1)}>
                            <LeftOutlined className='left-icon' />
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
                                                <DeleteOutlined className='delete-item' onClick={() => handleRemoveItem(item.id)} />
                                            </div>
                                            <QuantityInput 
                                                countInStock={item.countInStock} 
                                                initialQuantity={item.quantity > item.countInStock ? item.countInStock : item.quantity} 
                                                itemId={item.id}
                                                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
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
                    <div className='container-right'>
                        <span className='span-title'>Thông tin đơn hàng</span>
                        <div className='container-price-right'>
                            <span className='provisional-price'>Tạm tính:</span>
                            <span className='total-price'>{totalSelectedPrice.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <span className='span-note'>Quý khách vui lòng kiểm tra lại Giỏ hàng và sản phẩm tặng kèm (nếu có) trước khi tiến hành thanh toán</span>
                        <button className='next-button' onClick={handleCheckout}>
                            <span>TIẾN HÀNH THANH TOÁN</span> 
                            <RightOutlined className='right-icon' />
                        </button>
                    </div>
                </Col>
            </Row>
        </WrapperBgColorComponent>
    )
}

export default CartPage