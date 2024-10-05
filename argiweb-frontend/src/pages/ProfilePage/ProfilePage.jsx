import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import BreadcrumbComponent from '../../components/BreadcrumbComponent/BreadcrumbComponent'
import './ProfilePage.scss'
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, HeartOutlined, CommentOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { logoutUser, updateUser, getDetailUser } from '../../services/UserService';


import {Row, Col, Form, Input, Radio, DatePicker, Button, message} from 'antd';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const details = await getDetailUser(userId);
          setUserData(details.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        console.error('User ID not found in localStorage');
      }
    };

    fetchUserDetails();
  }, [userId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: (data) => {
        message.success('User updated successfully');
        queryClient.invalidateQueries(['userDetails', userId]); 
        window.location.reload();
    },
    onError: (error) => {
      message.error('Failed to update user');
      console.error(error);
    }
  });

  const handleSubmit = (values) => {
    const updatedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null
    };
    mutate(updatedData);
  };

  const breadcrumbs = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tài khoản của tôi' },
    { label: 'Thông tin của tôi' }
  ];

  const [activeTab, setActiveTab] = useState('info');

  const renderContent = () => {
    if (!userData) {
      return <div>Loading...</div>;
    }
    switch (activeTab) {
      case 'info':
        return (
          <Fragment>
            <h2 className='profile-title'>Thông tin tài khoản</h2>
            <Form 
              onFinish={handleSubmit} 
              initialValues={{
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                gender: userData.gender,
                birthday: userData.birthday ? moment(userData.birthday, 'YYYY-MM-DD') : null,
              }}
              layout="horizontal" 
              labelCol={{ span: 5 }}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email người dùng!' }]}>
                <Input placeholder="Nhập email" disabled/>
              </Form.Item>
              <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
                <Input placeholder="Nhập tên người dùng" />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender">
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Sinh nhật"
                name="birthday"
              >
                <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YY" />
              </Form.Item>
              <Button className='button-save' type="primary" htmlType="submit" loading={isLoading}>
                LƯU THAY ĐỔI
              </Button>
            </Form>
          </Fragment>
        );
      case 'orders':
        return <div>Đơn hàng của tôi</div>;
      case 'vouchers':
        return <div>Voucher của tôi</div>;
      case 'favorites':
        return <div>Sản phẩm yêu thích</div>;
      case 'reviews':
        return <div>Nhận xét của tôi</div>;
      case 'notifications':
        return <div>Thông báo của tôi</div>;
      default:
        return null;
    }
  };

  return (
    <WrapperBgColorComponent>
      <BreadcrumbComponent breadcrumbs={breadcrumbs}/>
      <div className='container'>
        <Row>
          <Col span={8}>
            <div className='widget mr20'>
              <div className='uname'>
                <span className='t1 medium'>Tài khoản</span>
                <span className='t2 semi-bold'>{userData?.name}</span>
                <span className='t1'>{userData?.email}</span>
              </div>
              <div className="menu-account">
                <div onClick={() => setActiveTab('info')}><UserOutlined /> Thông tin của tôi</div>
                <div onClick={() => setActiveTab('orders')}><ShoppingCartOutlined /> Đơn hàng của tôi</div>
                <div onClick={() => setActiveTab('vouchers')}><DollarOutlined /> Voucher của tôi</div>
                <div onClick={() => setActiveTab('favorites')}><HeartOutlined /> Sản phẩm yêu thích</div>
                <div onClick={() => setActiveTab('reviews')}><CommentOutlined /> Nhận xét của tôi</div>
                <div onClick={() => setActiveTab('notifications')}><BellOutlined /> Thông báo của tôi</div>
                <div><a href='/' onClick={logoutUser}><LogoutOutlined /> Đăng xuất</a></div>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className='widget'>
              {renderContent()}
            </div>
          </Col>
        </Row>
      </div>
    </WrapperBgColorComponent>
  )
}




export default ProfilePage