import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { fetchProductCount } from '../../services/ProductService';
import { fetchUserCount } from '../../services/UserService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const AdminDashBoardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const users = await fetchUserCount();
      const products = await fetchProductCount();

      setUserCount(users);
      setProductCount(products);
      setChartData([
        { name: 'Người dùng', count: users },
        { name: 'Sản phẩm', count: products },
      ]);
    };

    getData();
  }, []);

  return (
    <div>
      <h2>Tổng quan</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Số lượng người dùng" bordered={false}>
            <h1>{userCount}</h1>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Số lượng sản phẩm" bordered={false}>
            <h1>{productCount}</h1>
          </Card>
        </Col>
      </Row>

      <Card title="Biểu đồ thống kê" style={{ marginTop: 16 }}>
        <BarChart width={500} height={250} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Bar dataKey="count" fill="#FF9A00" />
        </BarChart>
      </Card>
    </div>
  );
};

export default AdminDashBoardPage;
