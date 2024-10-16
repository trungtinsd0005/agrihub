import React, { Fragment } from 'react'
import WrapperBgColorComponent from '../WrapperBgColorComponent/WrapperBgColorComponent'
import { Col, Image, Row } from 'antd'
import {
  EnvironmentOutlined,
  FacebookOutlined,
  HomeOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/logobrand.png'
import './FooterComponent.scss'

const FooterComponent = () => {
  return (
    <Fragment>
      <div className='cs-footer'></div>
      <footer className='main-container'>
        <div className='logo-container'>
          <img src={logo} alt="logo" />
          <span className='brand-name'>AGRIHUB</span>
        </div>
        <Row gutter={100}>
            <Col span={8}>
              <div className='footer-info' >
                <HomeOutlined className='custom-icon'/>
                <span className='info'>CÔNG TY TNHH CÔNG NGHỆ VÀ THƯƠNG MẠI UFO</span>
              </div>
              <div className='footer-info' >
                <EnvironmentOutlined className='custom-icon'/>
                <span className='info'>Tầng 2, Toà nhà số 109-111, Đường 08
                , KDC Hồng Phát, Phường An Khánh, Quận Ninh Kiều, Thành phố Cần Thơ, Việt Nam</span>
              </div>
              <div className='footer-info' >
                <MailOutlined className='custom-icon'/>
                <span className='info'>info@agrihub.com</span>
              </div>
              <div className='footer-info' >
                <PhoneOutlined className='custom-icon'/>
                <span className='info'>0836133816 (8h00 - 18h00)</span>
              </div>
              <div className='contact-icon'>
                <FacebookOutlined className='facebook-icon' />
                <TwitterOutlined className='twitter-icon'/>
                <InstagramOutlined className='insta-icon' />
                <YoutubeOutlined className='youtube-icon' />
              </div>
            </Col>
            <Col span={8}>
              <div className='col-center__container'>
                <div className='title-center'>
                  TÀI KHOẢN
                </div>
                <a href='http://localhost:3000/profile-user'>
                  Tài khoản của tôi
                </a>
                <a href='http://localhost:3000/cart'>
                  Giỏ hàng
                </a>
              </div>

              <div className='col-center__container'>
                <div className='title-center'>
                  THÔNG TIN
                </div>
                <a href='http://localhost:3000'>
                  Về Agrihub.com
                </a>
                <a href='http://localhost:3000'>
                  Điều khoản và điều kiện sử dụng
                </a>
                <a href='http://localhost:3000'>
                  Chính sách bảo mật và thông tin
                </a>
              </div>
            </Col>
            <Col span={8}>
              <div className='col-center__container'>
                <div className='title-center'>
                  HỖ TRỢ
                </div>
                <a href='http://localhost:3000'>
                  Phương thức thanh toán
                </a>
                <a href='http://localhost:3000'>
                  Vận chuyển, giao nhận và kiểm hàng
                </a>
                <a href='http://localhost:3000'>
                  Chính sách đổi trả và hoàn tiền
                </a>
                <a href='http://localhost:3000'>
                  Liên hệ
                </a>
              </div>
            </Col>
        </Row>
        <div className='tier-line'>Copyright © Agrihub 2024. All rights reserved.</div>
      </footer>
    </Fragment>
  )
}

export default FooterComponent