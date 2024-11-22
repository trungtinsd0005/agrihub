import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import {
  createInvoice,
  getAllInvoice,
  getInvoiceDetails,
  printInvoice,
} from "../../services/InvoiceService";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getAllProduct } from "../../services/ProductService";

const { Option } = Select;

const AdminInvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [products, setProducts] = useState([{ product: "", quantity: 0 }]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await getAllInvoice();
        setInvoices(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Lỗi khi tải danh sách hóa đơn");
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProduct();
        setProductsData(res.data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách sản phẩm");
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const res = await getInvoiceDetails(id);
      setInvoiceDetails(res);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết hóa đơn");
    }
  };

  const handlePrintInvoice = async (id) => {
    try {
      await printInvoice(id);
      message.success("In hóa đơn thành công");
    } catch (error) {
      message.error("Lỗi khi in hóa đơn");
    }
  };

  const handleAddInvoice = async () => {
    try {
      const invoiceData = {
        supplier: supplier,
        products: products.map((p) => {
          console.log("p:", p);
          const productData = productsData.find(
            (prod) => prod._id === p.product
          );
          return {
            product: p.product,
            name: productData ? productData.name : "Tên không xác định",
            quantity: p.quantity,
            price: p.price,
          };
        }),
      };

      if (
        !invoiceData.supplier ||
        invoiceData.products.some((p) => !p.product)
      ) {
        message.error("Vui lòng điền đầy đủ thông tin hóa đơn.");
        return;
      }
      await createInvoice(invoiceData);
      message.success("Thêm phiếu nhập thành công");
      setIsAddModalVisible(false);

      const updatedInvoices = await getAllInvoice();
      setInvoices(updatedInvoices.data);
    } catch (error) {
      message.error("Lỗi khi thêm phiếu nhập");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getColumnSearchProps = (dataIndex) => ({
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
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
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

  // Cột bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      ...getColumnSearchProps("supplier"),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `${text.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Create Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleViewDetails(record._id)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button onClick={() => handlePrintInvoice(record._id)}>
            Print Invoice
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add Invoice
      </Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={invoices}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: invoices.length,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],
        }}
      />

      <Modal
        title="Invoice Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {invoiceDetails && (
          <div style={{ padding: "20px" }}>
            <h3>ID: {invoiceDetails._id}</h3>
            <h3>Supplier: {invoiceDetails.supplier}</h3>
            <h4>Date: {new Date(invoiceDetails.createdAt).toLocaleString()}</h4>
            <ul>
              {invoiceDetails.products.map((item) => (
                <li key={item.product}>
                  {item.name} (x{item.quantity}) -{" "}
                  {item.price.toLocaleString("vi-VN")} VND
                </li>
              ))}
            </ul>
            <h4>
              Total: {invoiceDetails.totalAmount.toLocaleString("vi-VN")} VND
            </h4>
          </div>
        )}
      </Modal>
      <Modal
        title="Thêm phiếu nhập"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddInvoice}
      >
        <Form
          layout="vertical"
          onFinish={handleAddInvoice}
          style={{ padding: "20px" }}
        >
          <Form.Item label="Nhà cung cấp" required name="supplier">
            <Input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Nhập tên nhà cung cấp"
            />
          </Form.Item>

          <Form.Item label="Danh sách sản phẩm" required>
            {products.map((product, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <Input.Group compact>
                  <Select
                    style={{ width: "40%" }}
                    placeholder="Chọn sản phẩm"
                    value={product.product}
                    onChange={(value) => {
                      const newProducts = [...products];
                      newProducts[index].product = value;
                      setProducts(newProducts);
                    }}
                  >
                    {productsData.map((p) => (
                      <Option key={p._id} value={p._id}>
                        {p.name}
                      </Option>
                    ))}
                  </Select>

                  <Input
                    style={{ width: "40%", marginLeft: "10px" }}
                    value={product.quantity}
                    type="number"
                    placeholder="Số lượng"
                    onChange={(e) => {
                      const newProducts = [...products];
                      newProducts[index].quantity = parseInt(e.target.value);
                      setProducts(newProducts);
                    }}
                  />

                  <Input
                    style={{ width: "40%", marginTop: "10px" }}
                    value={product.price}
                    type="number"
                    placeholder="Giá nhập"
                    onChange={(e) => {
                      const newProducts = [...products];
                      newProducts[index].price = parseFloat(e.target.value);
                      setProducts(newProducts);
                    }}
                  />
                </Input.Group>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() =>
                setProducts([...products, { product: "", quantity: 0 }])
              }
            >
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminInvoicePage;
