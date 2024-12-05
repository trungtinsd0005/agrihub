import { Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logobrand.png";
import "./VoucherModal.scss";
import { getUserVouchers } from "../../services/UserService";
import { applyVoucher } from "../../services/VoucherSercice";

const VoucherModal = ({ visible, onCancel, subtotal, setDiscountValue }) => {
  const [vouchers, setVouchers] = useState([]);
  const userId = localStorage.getItem("userId");

  const formatValue = (value) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    } else if (value == 0) {
      return value + "đ";
    } else {
      return value + "%";
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      if (userId) {
        try {
          const data = await getUserVouchers(userId);
          setVouchers(data);
        } catch (error) {
          console.error("Error fetching vouchers:", error);
        }
      }
    };
    fetchVouchers();
  }, [userId]);

  const handleApplyVoucher = async (voucher) => {
    if (subtotal < voucher.minOrderValue) {
      message.error("Đơn hàng chưa đủ điều kiện sử dụng mã giảm giá.");
      return;
    }

    try {
      const response = await applyVoucher({
        code: voucher.code,
        orderValue: subtotal,
      });

      if (response.message === "Sử dụng voucher thành công!") {
        const discount = response.discount;
        setDiscountValue(discount);
        message.success(
          `Áp dụng mã giảm giá ${voucher.code} thành công!
          `
        );
        onCancel();
      } else {
        message.error("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá", error);
      message.error(error.response?.data?.message);
    }
  };
  return (
    <Modal visible={visible} onCancel={onCancel} footer={null} width={550}>
      <div className="voucher-modal">
        <h2 className="voucher-title">Danh sách mã giảm giá đơn hàng</h2>
        {vouchers.map((voucher) => (
          <div className="voucher-item">
            <div className="voucher-item__left">
              <img src={logo} alt="Logo" className="logo__voucher" />
              <div className="brand-name__voucher">AGRIHUB</div>
            </div>
            <div className="voucher-info">
              <p>Mã: {voucher.code}</p>
              <p>Giảm {formatValue(voucher.discount)}</p>
              <p>Đơn tối thiểu {formatValue(voucher.minOrderValue)}</p>
              <p>
                HSD:{" "}
                {new Date(voucher.expirationDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="voucher-item__right">
              <Button
                className="voucher-button br5 p20"
                onClick={() => handleApplyVoucher(voucher)}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default VoucherModal;
