import { Button, Card, Input } from "antd";
import "./ProfileTabs.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logobrand.png";

const MyVoucher = ({ vouchers }) => {
  const navigate = useNavigate();

  const formatValue = (value) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    } else if ((value = 0)) {
      return value + "đ";
    } else {
      return value + "%";
    }
  };

  return (
    <div className="bgColor">
      <div className="box p20">
        <div className="profile-title">Voucher của tôi</div>
        <div className="container-head__voucher">
          <Input
            className="voucher-input"
            placeholder="Nhập mã giảm giá"
          ></Input>
          <Button className="voucher-button p20">LƯU VOUCHER</Button>
        </div>
      </div>
      <div className="box p20 mt20">
        <div className="container-content__voucher">
          {vouchers.map((voucher) => (
            <Card key={voucher._id} className="custom-card__voucher">
              <div className="card-container__voucher">
                <div className="card-voucher__left">
                  <img src={logo} alt="Logo" className="logo__voucher" />
                  <div className="brand-name__voucher">AGRIHUB</div>
                </div>
                <div className="card-voucher__right">
                  <div className="card-voucher-info">
                    <h4>{`[${voucher.code}] Giảm ${formatValue(
                      voucher.discount
                    )} - Đơn từ ${formatValue(voucher.minOrderValue)}`}</h4>
                    <p>
                      {`Chỉ còn ${voucher.maxUses - voucher.usedCount} lượt`}
                    </p>
                    {voucher.expirationDate && (
                      <span className="date-voucher">{`Hết hạn vào ${new Date(
                        voucher.expirationDate
                      ).toLocaleDateString("vi-VN")}`}</span>
                    )}
                  </div>
                  <div className="card-voucher__button">
                    <Button
                      className="voucher-button p20-10"
                      onClick={() => navigate("/")}
                    >
                      MUA NGAY
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyVoucher;
