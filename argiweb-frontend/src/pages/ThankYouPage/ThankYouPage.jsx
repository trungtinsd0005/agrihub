import { Button, Result } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ThankyouPage = () => {
    const navigate = useNavigate();
    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Result
        status="success"
        title="Cảm ơn bạn đã mua hàng!"
        subTitle="Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất."
        extra={[
          <Button type="primary" key="home" onClick={handleBackToHome}>
            Về trang chủ
          </Button>,
          <Button key="orderDetails">
            Xem chi tiết đơn hàng
          </Button>,
        ]}
        />
    )
}

export default ThankyouPage