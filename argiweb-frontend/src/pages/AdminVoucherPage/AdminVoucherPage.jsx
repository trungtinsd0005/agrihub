import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Row,
  Col,
  Card,
  InputNumber,
  DatePicker,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  createVoucher,
  getAllVouchers,
  updateVoucher,
  deleteVoucher,
} from "../../services/VoucherSercice";
import "./AdminVoucherPage.scss";

const { Option } = Select;

const AdminVoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const res = await getAllVouchers();
        setVouchers(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Lỗi khi tải danh sách vouchers");
      }
    };

    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (values) => {
    try {
      await createVoucher(values);
      message.success("Tạo voucher thành công!");
      const res = await getAllVouchers();
      setVouchers(res.data);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  };

  const handleEditVoucher = async (values) => {
    try {
      await updateVoucher(editVoucher.code, values);
      message.success("Cập nhật voucher thành công!");

      const res = await getAllVouchers();
      setVouchers(res.data);

      setIsEditModalVisible(false);
      setEditVoucher(null);
      form.resetFields();
    } catch (error) {
      message.error("Không thể cập nhật voucher!");
    }
  };

  const handleDeleteVoucher = async (code) => {
    try {
      await deleteVoucher(code);
      message.success("Xóa voucher thành công!");
      setVouchers((prevVouchers) =>
        prevVouchers.filter((voucher) => voucher.code !== code)
      );
    } catch (error) {
      message.error("Không thể xóa voucher!");
    }
  };

  const isExpired = (voucher) => {
    const currentDate = new Date();
    return new Date(voucher.expirationDate) < currentDate;
  };

  const isMaxUsesReached = (voucher) => {
    return voucher.usedCount >= voucher.maxUses;
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 32 }}
      >
        Create Voucher
      </Button>
      <Row gutter={[16, 16]}>
        {vouchers.map((voucher) => {
          const expired = isExpired(voucher);
          const maxUsesReached = isMaxUsesReached(voucher);
          return (
            <Col key={voucher.code} span={6}>
              <Card
                title={`Voucher: ${voucher.code}`}
                className={`custom-card ${
                  expired || maxUsesReached ? "card-expired" : ""
                }`}
                bordered
                onClick={() => {
                  setEditVoucher(voucher);
                  console.log(voucher);
                  form.setFieldsValue({
                    ...voucher,
                    expirationDate: dayjs(voucher.expirationDate),
                  });
                  setIsEditModalVisible(true);
                }}
                extra={
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVoucher(voucher.code);
                    }}
                    className="voucher-button__delete"
                  >
                    <CloseOutlined />
                  </Button>
                }
              >
                <p>
                  Giảm giá:{" "}
                  {voucher.type === "percentage"
                    ? `${voucher.discount}%`
                    : `${voucher.discount}₫`}
                </p>
                <p>
                  Giá trị đơn tối thiểu:{" "}
                  {voucher.minOrderValue.toLocaleString("vi-VN")}₫
                </p>
                <p>
                  HSD:{" "}
                  {voucher.expirationDate
                    ? new Date(voucher.expirationDate).toLocaleDateString()
                    : "Vô hạn"}
                </p>
                <p>Số lần sử dụng tối đa: {voucher.maxUses}</p>
                <p>Số lần đã sử dụng: {voucher.usedCount}</p>
                <p>Đối tượng sử dụng: {voucher.targetAudience}</p>
                {expired && <p className="status-text">Đã hết hạn</p>}
                {maxUsesReached && (
                  <p className="status-text">Đạt số lần sử dụng tối đa</p>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="Thêm mới voucher"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateVoucher}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
          >
            <Input placeholder="Nhập mã voucher" />
          </Form.Item>

          <Form.Item
            name="targetAudience"
            label="Voucher dành cho"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn đối tượng nhận voucher",
              },
            ]}
          >
            <Select
              placeholder="Chọn đối tượng nhận voucher"
              onChange={(value) => setTargetAudience(value)}
            >
              <Option value="newUser">Khách hàng mới</Option>
              <Option value="loyalCustomer">Khách hàng thân thiết</Option>
              <Option value="allUsers">Tất cả khách hàng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại giảm giá"
            rules={[
              { required: true, message: "Vui lòng chọn loại giảm giá!" },
            ]}
          >
            <Select placeholder="Chọn loại giảm giá">
              <Option value="percentage">Giảm theo phần trăm</Option>
              <Option value="fixed">Giảm theo số tiền cố định</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="Mức giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập mức giảm giá!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập mức giảm giá"
            />
          </Form.Item>

          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn tối thiểu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị đơn tối thiểu!",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập giá trị đơn tối thiểu"
            />
          </Form.Item>

          {targetAudience !== "newUser" && (
            <Form.Item
              name="expirationDate"
              label="Ngày hết hạn"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Form.Item
            name="maxUses"
            label="Số lần sử dụng tối đa"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lần sử dụng tối đa!",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số lần sử dụng tối đa"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Thêm voucher
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa Voucher"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditVoucher}
          layout="vertical"
          style={{ padding: "20px" }}
        >
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại giảm giá"
            rules={[
              { required: true, message: "Vui lòng chọn loại giảm giá!" },
            ]}
          >
            <Select placeholder="Chọn loại giảm giá">
              <Option value="percentage">Giảm theo phần trăm</Option>
              <Option value="fixed">Giảm theo số tiền cố định</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discount"
            label="Mức giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập mức giảm giá!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập mức giảm giá"
            />
          </Form.Item>
          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn tối thiểu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị đơn tối thiểu!",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập giá trị đơn tối thiểu"
            />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Ngày hết hạn"
            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maxUses"
            label="Số lần sử dụng tối đa"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lần sử dụng tối đa!",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số lần sử dụng tối đa"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Cập nhật voucher
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminVoucherPage;
