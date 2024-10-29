import React, { useState, useEffect } from 'react';
import { Badge, Col, Dropdown, Input, Menu, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, BellOutlined} from '@ant-design/icons';
import './HeaderComponent.scss';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/images/logobrand.png';
import AuthModalComponent from '../AuthModalComponent/AuthModalComponent';
import { useNavigate } from 'react-router-dom';
import { getSearchProduct } from '../../services/ProductService';
import Suggestion from '../SuggestionComponent/Suggestion';
import { clearCart } from '../../redux/slides/cartSlide';
import store from '../../redux/store';
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

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');


  const handleLogoutUser = () => {
    dispatch(clearCart());
    localStorage.removeItem('userId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('address');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('selectedProducts');
    localStorage.removeItem(`cart_${userId}`);
    navigate('/');
    window.location.reload();
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span onClick={() => navigate(isAdmin ? '/system' : '/profile-user')}>{label}</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span onClick={handleLogoutUser}>Đăng xuất</span>
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
        const filteredSuggestions = response.data.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
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

  const handleNavigateCartPage = () => {
    navigate('/cart')
  }


  return (
    <>
      <div className="announcement-header">MIỄN PHÍ GIAO HÀNG CHO ĐƠN HÀNG TỪ 499K</div>
      <div className="header">
        <Col span={8} onClick={() => navigate('/')}>
          <div className='logo-container__header'>
            <img src={logo} alt="Logo" className="logo" />
            <div className="brand-name">AGRIHUB</div>
          </div>
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
            
              <Badge count={cartCount} size="small" onClick={handleNavigateCartPage}>
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
