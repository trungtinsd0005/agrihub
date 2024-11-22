import React, { useState, useEffect } from "react";
import { Modal, Tabs, message, Table, Button, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getAllOrder } from "../../services/OrderService";
import { updateOrderStatus } from "../../services/OrderService";
import "./AdminOrderPage.scss";

const { Option } = Select;

const AdminOrderPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orderData, setOrderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        setFilteredOrders(filterOrdersByStatus(activeTab, orders));
      } catch (error) {
        message.error("Failed to fetch Orders");
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
    if (status === "all") {
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

  const getColumnSearchProps = (dataIndex, dataAccessor) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          id="searchInput"
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
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
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#0A923C" : undefined }} />
    ),
    onFilter: (value, record) => {
      const fieldValue = dataAccessor
        ? dataAccessor(record)
        : record[dataIndex];
      return fieldValue
        ? fieldValue.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          const searchInput = document.getElementById("searchInput");
          if (searchInput) searchInput.select();
        }, 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
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
    setSearchText("");
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "idOrder",
      key: "idOrder",
      ...getColumnSearchProps("idOrder"),
      width: 100,
    },
    {
      title: "Order Date",
      key: "orderDate",
      render: (date) => {
        return new Date(date.createdAt).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
        });
      },
      width: 200,
    },
    {
      title: "Customer Name",
      key: "fullName",
      ...getColumnSearchProps(
        "fullName",
        (record) => record.shippingAddress?.fullName || ""
      ),
      render: (text, record) =>
        searchedColumn === "fullName" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={record.shippingAddress?.fullName || ""}
          />
        ) : (
          record.shippingAddress?.fullName
        ),
      width: 250,
    },
    {
      title: "Number Phone",
      key: "phone",
      ...getColumnSearchProps(
        "phone",
        (record) => record.shippingAddress?.phone || ""
      ),
      render: (text, record) =>
        searchedColumn === "phone" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={record.shippingAddress?.phone || ""}
          />
        ) : (
          record.shippingAddress?.phone
        ),
      width: 200,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toLocaleString("vi-VN"),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return (
          <Select
            value={status}
            style={{ width: 150 }}
            onChange={(value) => handleChangeStatus(record, value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        );
      },
      width: 150,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "createdAt",
      render: (pay) => pay.toUpperCase(),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
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
        message.success("Order status updated successfully");
        setOrderData((prevOrders) =>
          prevOrders.map((order) =>
            order._id === res.data._id
              ? { ...order, status: res.data.status }
              : order
          )
        );
        setFilteredOrders(filterOrdersByStatus(activeTab, orderData));
        setReloadOrders(true);
      }
    } catch (error) {
      message.error("Failed to update order status");
      console.error("Error updating status:", error);
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
        <Tabs.TabPane tab="Processing" key="processing" />
        <Tabs.TabPane tab="Shipped" key="shipped" />
        <Tabs.TabPane tab="Delivered" key="delivered" />
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
          pageSizeOptions: ["10", "15", "20"],
        }}
      />

      <Modal
        title="Order Details"
        visible={isDetailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <Button
            className="custom-modal__button"
            key="close"
            onClick={handleCloseDetailModal}
          >
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="custom-modal__container">
            <p>
              <strong>Order ID:</strong> {selectedOrder.idOrder}
            </p>
            <p>
              <strong>Customer Name:</strong>{" "}
              {selectedOrder.shippingAddress.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.ward}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.province}`}
            </p>
            <p>
              <strong>Total Price:</strong>{" "}
              {selectedOrder.totalPrice.toLocaleString("vi-VN")} VND
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedOrder.paymentMethod.toUpperCase()}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Order Items:</strong>
            </p>
            {selectedOrder.orderItems.map((item, index) => (
              <ul>
                <li key={index}>
                  <strong>ID:</strong> {item._id}
                </li>
                <li key={index}>
                  <strong>Name:</strong> {item.name}
                </li>
                <li key={index}>
                  <strong>Price:</strong> {item.price.toLocaleString("vi-VN")}{" "}
                  VND
                </li>
                <li key={index}>
                  <strong>Amount:</strong> {item.quantity}
                </li>
              </ul>
            ))}
            {selectedOrder.note && (
              <p>
                <strong>Order Note:</strong> {selectedOrder.note}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrderPage;
