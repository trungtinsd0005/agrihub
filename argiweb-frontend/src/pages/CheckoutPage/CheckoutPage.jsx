import React from "react";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import { Col, Row } from "antd";
import { useNavigate } from 'react-router-dom';
import {LeftOutlined} from '@ant-design/icons'
import './CheckoutPage.scss';

const CheckoutPage = () => {
    const navigate = useNavigate();
    return (
        <WrapperBgColorComponent>
            <Row>
                <Col span={16}>
                    <button className='back-button' onClick={() => navigate(-1)}>
                        <LeftOutlined className='left-icon' />
                        QUAY LẠI
                    </button>
                    <div className="rc-infor">
                        <div className="rc-infor__title">
                            <span>Thông tin nhận hàng</span>
                            <div>Bạn đã có tài khoản? 
                                <span>Đăng nhập ngay</span>
                            </div>
                        </div>
                        <div>
                            <span>*</span>
                            <span>Đăng nhập</span>
                            <span>để nhận được thông báo về tình trạng đơn hàng</span>
                        </div>
                        <div class="input-container">
                            <label for="name" class="input-label">Name</label>
                            <input type="text" id="name" class="input-field" />
                        </div>
                        <div class="input-container">
                            <label for="phone" class="input-label">Phone</label>
                            <input type="text" id="phone" class="input-field" />
                        </div>
                    </div>
                </Col>
                <Col span={8}>
                </Col>
            </Row>
        </WrapperBgColorComponent>
    )
}

export default CheckoutPage