import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import {
  fetchProductCount,
  fetchProductSalesData,
  fetchSlowSellingProducts,
  getAllProduct,
} from "../../services/ProductService";
import { fetchUserCount } from "../../services/UserService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import dayjs from "dayjs";
import { getAllOrder, getRevenueStats } from "../../services/OrderService";

const AdminDashBoardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [productSalesData, setProductSalesData] = useState([]);
  const [productSlowSellingData, setProductSlowSellingData] = useState([]);
  const [bestSellerData, setBestSellerData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const users = await fetchUserCount();
      const fetchAllProduct = await getAllProduct();
      const productsCount = await fetchProductCount();
      const productsales = await fetchProductSalesData();
      const productSlowSales = await fetchSlowSellingProducts();
      const fetchAllOrder = await getAllOrder();
      const orders = fetchAllOrder.data.length;

      setUserCount(users);
      setProducts(fetchAllProduct.data);
      setProductCount(productsCount);
      setOrderCount(orders);
      setProductSalesData(productsales);
      setProductSlowSellingData(productSlowSales);
      setChartData([
        { name: "Người dùng", count: users },
        { name: "Sản phẩm", count: productsCount },
        { name: "Đơn hàng", count: orders },
      ]);

      const revenueStats = await getRevenueStats({
        interval: "month",
      });

      setRevenueData(
        revenueStats.data.map((item) => ({
          category: item.label,
          value: item.revenue,
        }))
      );
    };
    getData();
  }, []);

  useEffect(() => {
    const today = dayjs();
    const salesWindowDays = 30;
    const salesThreshold = 1;

    const bestSellerProducts = products
      .filter((product) => {
        const salesInLast30Days = product.salesHistory
          ?.filter(
            (sale) => today.diff(dayjs(sale.month), "days") <= salesWindowDays
          )
          .reduce((total, sale) => total + sale.totalCount, 0);

        return salesInLast30Days >= salesThreshold;
      })
      .map((product) => ({
        name: product.name,
        sales: product.salesHistory
          ?.filter(
            (sale) => today.diff(dayjs(sale.month), "days") <= salesWindowDays
          )
          .reduce((total, sale) => total + sale.totalCount, 0),
      }));

    setBestSellerData(bestSellerProducts);
  }, [products]);

  return (
    <div>
      <h2>Tổng quan</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Số lượng người dùng" bordered={false}>
            <h1>{userCount}</h1>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Số lượng sản phẩm" bordered={false}>
            <h1>{productCount}</h1>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Số lượng đơn hàng" bordered={false}>
            <h1>{orderCount}</h1>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Tổng doanh thu" bordered={false}>
            <h1>{revenueData[0]?.value.toLocaleString("Vi-vn")} VND</h1>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Biểu đồ thống kê">
            <BarChart width={500} height={400} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              <Bar dataKey="count" fill="#FF9A00" />
            </BarChart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ doanh thu sản phẩm đã bán được">
            <PieChart width={400} height={400}>
              <Pie
                data={productSalesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {productSalesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Biểu đồ sản phẩm bán chậm">
            <BarChart width={500} height={400} data={productSlowSellingData}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, textAnchor: "middle" }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="countInStock"
                fill="#d9534f"
                name="Tồn kho"
                barSize={50}
              />
              <Bar
                dataKey="selled"
                fill="#5bc0de"
                name="Đã bán"
                barSize={100}
              />
            </BarChart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ sản phẩm bán chạy">
            <BarChart width={500} height={400} data={bestSellerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, textAnchor: "middle" }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="sales"
                fill="#82ca9d"
                name="Bán được"
                barSize={40}
              />
            </BarChart>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashBoardPage;
