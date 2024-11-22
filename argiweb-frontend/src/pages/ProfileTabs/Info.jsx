import React from "react";
import { Form, Input, Radio, DatePicker, Select, Button, Spin } from "antd";
import moment from "moment";

const { Option } = Select;

const Info = ({
  userData,
  cityData,
  districtData,
  wardData,
  handleSubmit,
  handleCityChange,
  handleDistrictChange,
  isLoading,
}) => {
  if (!userData) {
    return <Spin tip="Đang tải thông tin..." />;
  }
  return (
    <div className="p20">
      <div className="profile-title">Thông tin tài khoản</div>
      <Form
        onFinish={handleSubmit}
        initialValues={{
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          street: userData.address?.street || "",
          province: userData.address?.province,
          district: userData.address?.district,
          ward: userData.address?.ward,
          gender: userData.gender,
          birthday: userData.birthday
            ? moment(userData.birthday, "YYYY-MM-DD")
            : null,
        }}
        layout="horizontal"
        labelCol={{ span: 5 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email người dùng!" },
          ]}
        >
          <Input placeholder="Nhập email" disabled />
        </Form.Item>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại chưa chính xác",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
        >
          <Select placeholder="Chọn Tỉnh/Thành phố" onChange={handleCityChange}>
            {cityData.map((city) => (
              <Option key={city.Id} value={city.Name}>
                {city.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district"
          rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
        >
          <Select
            placeholder="Chọn Quận/Huyện"
            onChange={handleDistrictChange}
            disabled={!districtData.length}
          >
            {districtData.map((district) => (
              <Option key={district.Id} value={district.Name}>
                {district.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Xã/Phường"
          name="ward"
          rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
        >
          <Select placeholder="Chọn Xã/Phường" disabled={!wardData.length}>
            {wardData.map((ward) => (
              <Option key={ward.Id} value={ward.Name}>
                {ward.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Số nhà, Tên đường"
          name="street"
          rules={[
            { required: true, message: "Vui lòng nhập số nhà và tên đường!" },
          ]}
        >
          <Input placeholder="Nhập số nhà, tên đường" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Radio.Group>
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
            <Radio value="Khác">Khác</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Sinh nhật" name="birthday">
          <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YY" />
        </Form.Item>
        <Button
          className="button-save"
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          LƯU THAY ĐỔI
        </Button>
      </Form>
    </div>
  );
};

export default Info;
