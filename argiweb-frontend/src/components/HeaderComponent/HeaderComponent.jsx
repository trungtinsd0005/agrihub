import React, { useState, useEffect } from 'react';
import { Badge, Col, Dropdown, Input, Menu } from 'antd';
import { UserOutlined, ShoppingCartOutlined, BellOutlined} from '@ant-design/icons';
import './HeaderComponent.scss';
import logo from '../../assets/images/logobrand.png';
import AuthModalComponent from '../AuthModalComponent/AuthModalComponent';
import { logoutUser } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { getSearchProduct } from '../../services/ProductService';
import Suggestion from '../SuggestionComponent/Suggestion';
const { Search } = Input;

const HeaderComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const token = localStorage.getItem('access_token');
  let decodedToken = null;
  if(token) {
    decodedToken = JSON.parse(atob(token.split('.')[1]));
  }
  const isAdmin = decodedToken ? decodedToken.payload.isAdmin : false;
  const label = isAdmin ? 'Trang Quản lý' : 'Tài khoản người dùng';

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span onClick={() => navigate(isAdmin ? '/system' : '/profile-user')}>{label}</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span onClick={logoutUser}>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        setUsername(storedUsername);
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchChange = async (value) => {
    setSearchValue(value);
    if (value) {
      try {
        const response = await getSearchProduct(value);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const onSearch = (value) => {
    if (value) {
      setSearchValue('');
      setSuggestions([]);
      navigate(`/search?keyword_search=${value}`);
    }
  };

  return (
    <>
      <div className="announcement-header">MIỄN PHÍ GIAO HÀNG CHO ĐƠN HÀNG TỪ 499K</div>
      <div className="header">
        <Col span={8} onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-name">ARGIHUB</span>
        </Col>
        <Col span={8}>
            <Search 
              placeholder="Nhập nội dung tìm kiếm" 
              allowClear 
              onSearch={onSearch} 
              onChange={(e) => onSearchChange(e.target.value)}
              className='search-input' 
            />
            {searchValue && suggestions.length > 0 && (
            <Suggestion
              suggestions={suggestions}
              onItemClick={(id) => {
                setSearchValue('');
                setSuggestions([]);
                navigate(`/product/${id}`)
              }}
              onSearch={() => onSearch(searchValue)}
              
            />
            )}
        </Col>
        <Col span={8}>
          <div className="container-icon">
            <div className='icon-section'>
              <BellOutlined className='header-icon'/>
              <span className='name-icon'>Thông báo</span>
            </div>
            {username ? (
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="icon-section">
                    <UserOutlined className="header-icon" />
                    <span className="name-icon">{username}</span>
                </div>
              </Dropdown>
            ) : (
              <UserOutlined className="header-icon" onClick={showModal} />
            )}
            
            <Badge count={4} size="small">
              <ShoppingCartOutlined className="header-icon" />
            </Badge>
          </div>
        </Col>
      </div>
      <AuthModalComponent visible={isModalVisible} onCancel={handleCancel} />
    </>
  );
};

export default HeaderComponent;
