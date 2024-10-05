import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUser, createUser, updateUser, deleteUser  } from '../../services/UserService';
import './AdminUserPage.scss'
import Highlighter from 'react-highlight-words';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUser();
      setUsers(res.data);
      setTotal(res.data.length || 0);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const showModal = (user) => {
    setCurrentUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    if (currentUser) {
      updateUser(currentUser._id, values).then(() => {
        message.success('User updated successfully');
        fetchUsers();
      });
    } else {
      createUser(values).then(() => {
        message.success('User created successfully');
        fetchUsers();
      });
    }
    handleCancel();
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success('User Deleted Successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (record) => {
    try {
      const updatedUser = { ...record, isAdmin: !record.isAdmin };
      await updateUser(updatedUser._id, updatedUser);
      message.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user role');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          id="searchInput"
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#0A923C' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.select();
        }, 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleDeleteMany = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected users?');
    if (confirmDelete) {
      try {
        await Promise.all(selectedRowKeys.map(id => deleteUser(id)));
        message.success('Selected users deleted successfully');
        fetchUsers();
        setSelectedRowKeys([]);
      } catch (error) {
        message.error('Failed to delete users');
      }
    }
  };

  const columns = [
    { title: 'ID', dataIndex: '_id', key: 'id', ...getColumnSearchProps('id')},
    { title: 'Username', dataIndex: 'name', key: 'name', sorter: (a,b) => a.name.length - b.name.length, ...getColumnSearchProps('name') },
    { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a,b) => a.email.length - b.email.length, ...getColumnSearchProps('email')},
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone', sorter: (a,b) => a.phone.length - b.phone.length, ...getColumnSearchProps('phone') },
    { 
      title: 'Role', 
      dataIndex: 'isAdmin', 
      key: 'isAdmin', 
      render: (isAdmin) => (isAdmin ? 'Admin' : 'User'),
      filters: [
        { text: 'Admin', value: true }, 
        { text: 'User', value: false },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
          >
            <Button danger style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
          <Button 
            type="dashed" 
            onClick={() => handleRoleChange(record)} 
            style={{ marginLeft: 8 }}>
            {record.isAdmin ? 'Revoke Admin' : 'Make Admin'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
        Add User
      </Button>
      <Button
        type="danger"
        onClick={handleDeleteMany}
        disabled={selectedRowKeys.length < 2}
        className='button-delete-many'
        icon={<DeleteOutlined />}
        style={{
          marginBottom: 16,
          backgroundColor: selectedRowKeys.length < 2 ? '#FFCCCC' : '#FF4D4F',
          color: selectedRowKeys.length < 2 ? '#fff' : '#fff',
          cursor: selectedRowKeys.length < 2 ? 'not-allowed' : 'pointer',
          opacity: selectedRowKeys.length < 2 ? 0.6 : 1,
          marginLeft: '10px'
        }}
      >
        Delete Selected Users
      </Button>
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="_id" 
        style={{ marginTop: 16 }} 
        loading={loading} 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
        }} 
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
        }}
      />

      <Modal 
        title="User Details" 
        visible={isModalVisible} 
        onCancel={handleCancel} 
        footer={null} 
      >
        <Form 
          form={form}
          onFinish={handleFormSubmit} 
          labelCol={{ span: 6 }}
          style={{margin: '0 10px', padding: '10px' }}
        >
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the Email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the Name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input the phone!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: !currentUser, message: 'Please input the password!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Pass" rules={[{ required: !currentUser, message: 'Please input the confirm password!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ display: 'flex', margin: '0 auto' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserPage;
