import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal, Tabs, Form, Input, Button, message } from 'antd';
import sideImage from '../../assets/images/imageLogin.png';
import './AuthModalComponent.scss';
import { loginUser, signupUser} from '../../services/UserService';

const { TabPane } = Tabs;

const AuthModalComponent = ({ visible, onCancel }) => {
    const [activeTab, setActiveTab] = useState('1');

    const { mutate: mutateLogin } = useMutation({
        mutationFn: loginUser
    });

    const { mutate: mutateSignup } = useMutation({
        mutationFn: signupUser
    });

    const onLoginFinish = (values) => {
        mutateLogin(values, {
            onSuccess: (data) => {
                if (data.status === 'OK') {
                    console.log('Đăng nhập thành công:', data);

                    localStorage.setItem('username', data.name);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    localStorage.setItem('userId', data._id);
                    
                    window.location.reload();
                    onCancel();

                    message.success('Đăng nhập thành công');
                }else {
                    console.error('Lỗi đăng nhập:', data.message);
                    message.error(data.message);
                }
            },
            onError: (error) => {
                console.error('Lỗi khi gọi API:', error);
                message.error('Lỗi hệ thống, vui lòng thử lại sau.');

            }
        });
    };

    const onRegisterFinish = (values) => {
        mutateSignup(values, {
            onSuccess: (data) => {
                if (data.status === 'OK') {
                    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                    setActiveTab('1');
                } else {
                    console.error('Lỗi đăng ký:', data.message);
                    message.error(data.message);
                }
            },
            onError: (error) => {
                console.error('Lỗi khi gọi API:', error);
                message.error('Lỗi hệ thống, vui lòng thử lại sau.');
            }
        });
    };

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={550}
        >
            <div className="modal-content">
                <div className="modal-left">
                    <h2 className="custom-modal-title">Argihub xin chào</h2>
                    <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
                        <TabPane tab="Đăng Nhập" key="1">
                            <Form
                                name="loginForm"
                                onFinish={onLoginFinish}
                                initialValues={{
                                    email: '',
                                    password: ''
                                }}
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                    ]}
                                >
                                    <Input.Password placeholder="Mật khẩu" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-button">
                                        Đăng Nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab="Đăng Ký" key="2">
                            <Form
                                name="registerForm"
                                onFinish={onRegisterFinish}
                                initialValues={{
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    name: '',
                                    phone: ''
                                }}
                            >
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                >
                                    <Input placeholder="Tên" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                                    ]}
                                >
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                    ]}
                                >
                                    <Input.Password placeholder="Mật khẩu" />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                                            }
                                        })
                                    ]}
                                >
                                    <Input.Password placeholder="Xác nhận mật khẩu" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="register-button">
                                        Đăng Ký
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                    </Tabs>
                </div>
                <div className="modal-right">
                    <img src={sideImage} alt="Side" />
                </div>
            </div>
        </Modal>
    );
};

export default AuthModalComponent;
