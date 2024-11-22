import { Button, Card, Input } from "antd";
import "./ProfileTabs.scss";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";

const MyVoucher = ({}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bgColor">
      <div className="box p20">
        <div className="profile-title">Voucher của tôi</div>
        <div className="container-head__voucher">
          <Input
            className="voucher-input"
            placeholder="Nhập mã giảm giá"
          ></Input>
          <Button className="voucher-button">LƯU VOUCHER</Button>
        </div>
      </div>
      <div className="box p20 mt20">
        <div className="container-content__voucher">
          <Card className="custom-card__voucher">
            <h4>Mã voucher</h4>
            <p>Ngày hết hạn</p>
            <Button className="voucher-button">MUA NGAY</Button>
          </Card>
          <Card className="custom-card__voucher">
            <h4>Mã voucher</h4>
            <p>Ngày hết hạn</p>
            <Button className="voucher-button">MUA NGAY</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyVoucher;
