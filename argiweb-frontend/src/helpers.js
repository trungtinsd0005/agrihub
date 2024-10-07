import React, { useEffect, useState } from "react";
import {Modal} from 'antd';
import AuthModalComponent from "./components/AuthModalComponent/AuthModalComponent";


export const Protector = ({ Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setModalVisible(true);
        }
    }, [isAuthenticated]);

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            {!isAuthenticated && (
                <Modal visible={modalVisible} onCancel={handleCancel} footer={null}>
                    <AuthModalComponent
                        visible={modalVisible}
                        onCancel={() => {
                            setModalVisible(false);
                            setIsAuthenticated(!!localStorage.getItem('access_token'));
                        }}
                    />
                </Modal>
            )}
            {isAuthenticated && Component}
        </>
    );
};