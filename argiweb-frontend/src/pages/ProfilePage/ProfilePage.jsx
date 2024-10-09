import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WrapperBgColorComponent from '../../components/WrapperBgColorComponent/WrapperBgColorComponent'
import BreadcrumbComponent from '../../components/BreadcrumbComponent/BreadcrumbComponent'
import './ProfilePage.scss'
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, HeartOutlined, CommentOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { updateUser, getDetailUser } from '../../services/UserService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slides/cartSlide';


import {Row, Col, Form, Input, Radio, DatePicker, Button, message, Spin, Select} from 'antd';
const { Option } = Select;

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
        );
        setCityData(response.data);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };
    fetchCityData();

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

  const handleCityChange = (cityName) => {
    const selectedCity = cityData.find((city) => city.Name === cityName);
    if (selectedCity) {
      setDistrictData(selectedCity.Districts);
      setWardData([]);
    }
  };

  const handleDistrictChange = (districtName) => {
    const selectedDistrict = districtData.find((district) => district.Name === districtName);
    if (selectedDistrict) {
      setWardData(selectedDistrict.Wards);
    }
  };

  const handleSubmit = (values) => {
    const updatedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
      address: {
        province: values.province,
        district: values.district,
        ward: values.ward,
        street: values.street,
      }
    };
    mutate(updatedData);
  };

  const handleLogoutUser = () => {
    dispatch(clearCart());
    localStorage.removeItem('userId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    navigate('/');
    window.location.reload();
  }

  const breadcrumbs = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tài khoản của tôi' },
    { label: 'Thông tin của tôi' }
  ];

  const [activeTab, setActiveTab] = useState('info');


  const renderContent = () => {
    if (!userData) {
      return <Spin tip="Đang tải thông tin..." />;
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
                street: userData.address?.street || '',
                province: userData.address?.province,
                district: userData.address?.district,
                ward: userData.address?.ward,
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

              <Form.Item label="Tỉnh/Thành phố" name="province" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}>
                <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleCityChange}>
                  {cityData.map((city) => (
                    <Option key={city.Id} value={city.Name}>
                      {city.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrictChange} disabled={!districtData.length}>
                  {districtData.map((district) => (
                    <Option key={district.Id} value={district.Name}>
                      {district.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Xã/Phường" name="ward" rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}>
                <Select placeholder="Chọn Xã/Phường" disabled={!wardData.length}>
                  {wardData.map((ward) => (
                    <Option key={ward.Id} value={ward.Name}>
                      {ward.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Số nhà, Tên đường" name="street" rules={[{ required: true, message: 'Vui lòng nhập số nhà và tên đường!' }]}>
                <Input placeholder="Nhập số nhà, tên đường" />
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
                <div><a href='/' onClick={handleLogoutUser}><LogoutOutlined /> Đăng xuất</a></div>
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