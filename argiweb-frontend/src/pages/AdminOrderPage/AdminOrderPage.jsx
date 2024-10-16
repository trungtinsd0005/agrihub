import React, { useState, useEffect } from 'react';
import { Modal, Tabs, message, Table, Button, Select } from 'antd';
import { getAllOrder } from '../../services/OrderService';
import { updateOrderStatus } from '../../services/OrderService';
import './AdminOrderPage.scss'

const { Option } = Select;

const AdminOrderPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reloadOrders, setReloadOrders] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
              const res = await getAllOrder();
              const orders = Array.isArray(res.data) ? res.data : [];
              setOrderData(orders);
              console.log('Order Data:', orders);
              setFilteredOrders(filterOrdersByStatus(activeTab, orders));
              setTotal(orders.length || 0);
            } catch (error) {
              message.error('Failed to fetch Orders');
              setOrderData([]);
              setFilteredOrders([]);
            } finally {
              setLoading(false);
            }
        };
        fetchOrders();

        if (reloadOrders) {
            setReloadOrders(false);
        }
    }, [activeTab, reloadOrders]);

    

    const filterOrdersByStatus = (status, orders) => {
        if (status === 'all') {
          return orders;
        }
        return orders.filter((order) => order.status === status);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setFilteredOrders(filterOrdersByStatus(key, orderData));
        setCurrentPage(1);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            render: (text) => `#${text.toUpperCase().slice(3, 4)}${text.toUpperCase().slice(-4)}`,
            width: 100,
        },
        {
            title: 'Order Date',
            key: 'orderDate',
            render: (date) => {
                return new Date(date.createdAt).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                });
            },
            width: 200,
        },
        {
            title: 'Customer Name',
            key: 'fullName',
            render: (record) => record.shippingAddress.fullName,
            width: 250,
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => price.toLocaleString('vi-VN'),
            width: 150,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                return (
                    <Select
                        value={status}
                        style={{ width: 150 }}
                        onChange={(value) => handleChangeStatus(record, value)}
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="shipped">Shipped</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>
                );
            },
            width: 150,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'createdAt',
            render: (pay) => pay.toUpperCase(),
            width: 150,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleViewDetails(record)}>View Details</Button>
                </div>
            ),
        },
    ];

    const handleViewDetails = (record) => {
        setSelectedOrder(record);
        setIsDetailModalVisible(true);
    };
    
    const handleChangeStatus = async (record, newStatus) => {
        if (!newStatus) return;
    
        try {
            const res = await updateOrderStatus(record._id, { status: newStatus });
            if (res.data) {
                message.success('Order status updated successfully');
                setOrderData((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === res.data._id ? { ...order, status: res.data.status } : order
                    )
                );
                setFilteredOrders(filterOrdersByStatus(activeTab, orderData));
                setReloadOrders(true);
            }
        } catch (error) {
            message.error('Failed to update order status');
            console.error('Error updating status:', error);
        }
    };


    const handleCloseDetailModal = () => {
        setIsDetailModalVisible(false);
    };


    return (
        <div>
            <Tabs defaultActiveKey="all" onChange={handleTabChange}>
                <Tabs.TabPane tab="All Orders" key="all" />
                <Tabs.TabPane tab="Pending" key="pending" />
                <Tabs.TabPane tab="Shipped" key="shipped" />
                <Tabs.TabPane tab="Completed" key="completed" />
                <Tabs.TabPane tab="Cancelled" key="cancelled" />
            </Tabs>

            <Table
                dataSource={paginatedOrders}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredOrders.length,
                onChange: handlePageChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20'],
                }}
            />

            <Modal
                title="Order Details"
                visible={isDetailModalVisible}
                onCancel={handleCloseDetailModal}
                footer={[
                    <Button className='custom-modal__button' key="close" onClick={handleCloseDetailModal}>
                        Close
                    </Button>,
                ]}
            >
                {selectedOrder && (
                    <div className='custom-modal__container'>
                        <p><strong>Order ID:</strong> {selectedOrder._id.toUpperCase().slice(3, 4)}{selectedOrder._id.toUpperCase().slice(-4)}</p>
                        <p><strong>Customer Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                        <p><strong>Address:</strong> {`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.ward}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.province}`}</p>
                        <p><strong>Total Price:</strong> {selectedOrder.totalPrice.toLocaleString('vi-VN')} VND</p>
                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                        <p><strong>Order Items:</strong></p>
                        {selectedOrder.orderItems.map((item, index) => (
                            <ul>
                                <li key={index}>
                                    <strong>ID:</strong> {item._id}
                                </li>
                                <li key={index}>
                                    <strong>Name:</strong> {item.name}
                                </li>
                                <li key={index}>
                                    <strong>Price:</strong> {item.price.toLocaleString('vi-VN')} VND
                                </li>
                                <li key={index}>
                                    <strong>Amount:</strong> {item.amount} 
                                </li>
                            </ul>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default AdminOrderPage