import React, { useState } from 'react';
import { Layout, Menu, Popconfirm, message} from 'antd';
import BreadcrumbComponent from '../../components/BreadcrumbComponent/BreadcrumbComponent';
import { DashboardOutlined, UserOutlined, ProductOutlined, LogoutOutlined, HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logobrand.png';
import AdminDashBoardPage from '../AdminDashBoardPage/AdminDashBoardPage';
import AdminUserPage from '../AdminUserPage/AdminUserPage';
import AdminProductPage from '../AdminProductPage/AdminProductPage';
import AdminOrderPage from '../AdminOrderPage/AdminOrderPage';
import './AdminPage.scss'
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slides/cartSlide';
import { useDispatch } from 'react-redux';

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: 'Home', path: '/' }, { label: 'Dashboard'}]);
  const dispatch = useDispatch();


  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);

    let newBreadcrumbs = [{ label: 'Home', path: '/' }];
    switch (e.key) {
      case '1':
        newBreadcrumbs.push({ label: 'Dashboard' });
        break;
      case '2':
        newBreadcrumbs.push({ label: 'User' });
        break;
      case '3':
        newBreadcrumbs.push({ label: 'Product'});
        break;
      case '4':
        newBreadcrumbs.push({ label: 'Order'});
        break;
      default:
        break;
    }
    setBreadcrumbs(newBreadcrumbs);
  };

  const navigate = useNavigate();

  const handleLogoutUser = () => {
    dispatch(clearCart());
    localStorage.removeItem('userId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('selectedProducts');
    navigate('/');
    window.location.reload();
  }

  const renderPage = (key) => {
    switch(key) {
      case '2':
        return (
          <AdminUserPage/>
        )
      case '3':
        return (
          <AdminProductPage/>
        )
      case '4':
      return (
        <AdminOrderPage/>
      )
      default:
        return (
          <AdminDashBoardPage/>
        )
    }
  }


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="container-logo"> 
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-name">AGRIHUB</span>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            User
          </Menu.Item>
          <Menu.Item key="3" icon={<ProductOutlined />}>
            Product
          </Menu.Item>
          <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
            Order
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            <Popconfirm
              title="Bạn có chắc chắn muốn đăng xuất?"
              onConfirm={handleLogoutUser}
              okText="Có"
              cancelText="Không"
            >
              Log out
            </Popconfirm>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <h2 style={{ textAlign: 'center', color:'#fff' }}>Admin Page</h2>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <BreadcrumbComponent breadcrumbs={breadcrumbs} />
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {renderPage(selectedKey)}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
