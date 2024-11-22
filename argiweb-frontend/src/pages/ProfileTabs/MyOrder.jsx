import "./ProfileTabs.scss";
import React, { useState } from "react";
import { Tabs, Button, Image, Spin, Steps } from "antd";
import {
  LeftOutlined,
  SolutionOutlined,
  DollarOutlined,
  CarOutlined,
  InboxOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
const { TabPane } = Tabs;

const MyOrder = ({
  orderData,
  handleCancelOrder,
  handleConfirmReceived,
  handleRepurchase,
  handleReview,
  handleChangePaymentMethod,
  handleMoMoPayment,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrderClick = (item) => {
    setLoading(true);
    setSelectedOrder(item);
    console.log("Order Details: ", item);
    setLoading(false);
  };

  const calculateTotalItemPrice = (order) => {
    return order.orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") {
      return orderData;
    }
    return orderData.filter((order) => order.status === status);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const renderOrderList = (orders) => {
    if (orders.length === 0) {
      return <p>Không có đơn hàng</p>;
    }

    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => (
        <div
          className="order-box"
          key={item._id}
          onClick={() => handleOrderClick(item)}
        >
          <div className="order__info-above">
            <div className="order-id">#{item.idOrder}</div>
            <div className="order-status">{getStatusLabel(item.status)}</div>
          </div>
          {item.orderItems.map((orderItem) => (
            <div className="order-item" key={orderItem._id}>
              <Image
                src={orderItem.image}
                alt={orderItem.name}
                height={80}
                preview={false}
                width={80}
              />
              <div className="product-name">{orderItem.name}</div>
              <div className="price-quantity__container">
                <div className="product-price">
                  {orderItem.price.toLocaleString("vi-VN")} ₫
                </div>
                <div className="product-quantity">
                  x{orderItem.quantity || orderItem.amount}
                </div>
              </div>
            </div>
          ))}
          <div className="tier-line__order"></div>
          <div className="order__info-below">
            <div className="order-time">
              <div>
                Đã đặt{" "}
                {new Date(item.createdAt).toLocaleString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>

              {item.isPaid && (
                <div>
                  Đã thanh toán{" "}
                  {new Date(item.paidAt).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              )}
            </div>
            <div className="order__total-price">
              Thành tiền:{" "}
              <span>{item.totalPrice.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
          {item.isDelivered && (
            <div className="order-time__container">
              <div>
                Đã giao{" "}
                {new Date(item.deliveredAt).toLocaleString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          <div
            className={`button-order-container ${
              item.status === "delivered" ||
              (item.paymentMethod === "momo" && !item.isPaid)
                ? "has-message"
                : ""
            }`}
          >
            {item.status === "delivered" && (
              <p>
                Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.
              </p>
            )}
            {item.status === "pending" &&
              item.paymentMethod === "momo" &&
              !item.isPaid && (
                <p>
                  Vui lòng thanh toán MOMO hoặc đổi phương thức thanh toán "COD"
                  trong 48h, nếu không đơn hàng sẽ bị hủy bỏ
                </p>
              )}
            <div>
              {item.status === "pending" && (
                <div className="inlineDiv">
                  <Button
                    className="custom-button__Order"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCancelOrder(item._id);
                    }}
                  >
                    Hủy Đơn Hàng
                  </Button>
                  <Button
                    className="custom-button__Order"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleChangePaymentMethod(item._id);
                    }}
                  >
                    Đổi Phương Thức Thanh Toán
                  </Button>
                </div>
              )}
              {item.status === "pending" &&
                item.paymentMethod === "momo" &&
                !item.isPaid && (
                  <div className="inlineDiv">
                    <Button
                      className="custom-button__Order primary-color"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMoMoPayment(item);
                      }}
                    >
                      Thanh Toán
                    </Button>
                  </div>
                )}
            </div>
            {item.status === "processing" && !item.isPaid && (
              <div>
                <Button
                  className="custom-button__Order"
                  onClick={() => handleChangePaymentMethod(item._id)}
                >
                  Đổi Phương Thức Thanh Toán
                </Button>
              </div>
            )}
            {item.status === "delivered" && (
              <Button
                className="custom-button__Order primary-color"
                onClick={() => handleConfirmReceived(item._id)}
              >
                Đã nhận được hàng
              </Button>
            )}
            {item.status === "cancelled" ? (
              <Button
                className="custom-button__Order"
                onClick={() => handleRepurchase(item.orderItems)}
              >
                Mua lại
              </Button>
            ) : item.status === "completed" ? (
              <div>
                <Button
                  className="custom-button__Order primary-color"
                  onClick={() => handleReview(item.orderItems)}
                >
                  Đánh giá
                </Button>
                <Button
                  className="custom-button__Order"
                  onClick={() => handleRepurchase(item.orderItems)}
                >
                  Mua lại
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ));
  };

  const getOrderStepIndex = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "completed":
        return 4;
      case "cancelled":
        return 5;
      default:
        return 0;
    }
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="order-details">
        <div className="order-details__header p20">
          <Button
            onClick={() => setSelectedOrder(null)}
            className="order-details__headerButton"
          >
            <LeftOutlined />
            TRỞ LẠI
          </Button>
          <div className="order-details__headerInfo">
            <span>MÃ ĐƠN HÀNG. {selectedOrder.idOrder}</span>
            <span className="separate">|</span>
            <span className="order-details__status">
              {getStatusLabel(selectedOrder.status).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="order-details__status-bar p20">
          <Steps
            size="default"
            current={getOrderStepIndex(selectedOrder.status)}
            labelPlacement="vertical"
          >
            <Step title="Đơn Hàng Đã Đặt" icon={<SolutionOutlined />} />
            <Step title="Đã Xác Nhận" icon={<DollarOutlined />} />
            <Step title="Đang Vận Chuyển" icon={<CarOutlined />} />
            <Step title="Chờ Giao Hàng" icon={<InboxOutlined />} />
            <Step title="Đánh Giá" icon={<StarOutlined />} />
          </Steps>
        </div>
        <div
          className={`button-order-container p20-lr ${
            selectedOrder.status === "delivered" ||
            (selectedOrder.paymentMethod === "momo" && !selectedOrder.isPaid)
              ? "has-message"
              : ""
          }`}
        >
          {selectedOrder.status === "delivered" && (
            <p>
              Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
              đến bạn và sản phẩm nhận được không có vấn đề nào.
            </p>
          )}
          {selectedOrder.paymentMethod === "momo" && !selectedOrder.isPaid && (
            <p>
              Vui lòng thanh toán MOMO hoặc đổi phương thức thanh toán "COD"
              trước ngày 4/11/2024, nếu không đơn hàng sẽ bị hủy bỏ
            </p>
          )}
          <div>
            {selectedOrder.status === "pending" && (
              <div className="inlineDiv">
                <Button
                  className="custom-button__Order"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                >
                  Hủy Đơn Hàng
                </Button>
                <Button
                  className="custom-button__Order"
                  onClick={() => handleChangePaymentMethod(selectedOrder._id)}
                >
                  Đổi Phương Thức Thanh Toán
                </Button>
              </div>
            )}
            {selectedOrder.status === "pending" &&
              selectedOrder.paymentMethod === "momo" &&
              !selectedOrder.isPaid && (
                <div className="inlineDiv">
                  <Button
                    className="custom-button__Order primary-color"
                    onClick={() => handleMoMoPayment(selectedOrder)}
                  >
                    Thanh Toán
                  </Button>
                </div>
              )}
          </div>

          {selectedOrder.status === "processing" && !selectedOrder.isPaid && (
            <div>
              <Button
                className="custom-button__Order"
                onClick={() => handleChangePaymentMethod(selectedOrder._id)}
              >
                Đổi Phương Thức Thanh Toán
              </Button>
            </div>
          )}
          {selectedOrder.status === "delivered" && (
            <Button
              className="custom-button__Order primary-color"
              onClick={() => handleConfirmReceived(selectedOrder._id)}
            >
              Đã nhận được hàng
            </Button>
          )}
          {selectedOrder.status === "cancelled" ? (
            <Button
              className="custom-button__Order"
              onClick={() => handleRepurchase(selectedOrder.orderItems)}
            >
              Mua lại
            </Button>
          ) : selectedOrder.status === "completed" ? (
            <div>
              <Button
                className="custom-button__Order primary-color"
                onClick={() => handleReview(selectedOrder.orderItems)}
              >
                Đánh giá
              </Button>
              <Button
                className="custom-button__Order"
                onClick={() => handleRepurchase(selectedOrder.orderItems)}
              >
                Mua lại
              </Button>
            </div>
          ) : null}
        </div>
        <div className="tier-line__multiColor"></div>
        <div className="order-details__user p20-lr">
          <h2>Địa Chỉ Nhận Hàng</h2>
          <p>
            <span>Tên người nhận:</span>{" "}
            {selectedOrder.shippingAddress.fullName}
          </p>
          <p>
            <span>Số điện thoại:</span> {selectedOrder.shippingAddress.phone}
          </p>
          <p>
            <span>Địa chỉ giao hàng:</span>{" "}
            {`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.ward}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.province}`}
          </p>
          <p>
            <span>Ghi chú:</span> {selectedOrder.note || "Không có"}
          </p>
        </div>
        <div className="tier-line__multiColor"></div>
        <div className="order-details-itemContainer">
          <h2 className="p20-lr">Danh sách sản phẩm</h2>
          {selectedOrder.orderItems.map((item) => (
            <div key={item._id} className="order-detail-item p20-lr">
              <div className="order-details-image">
                <Image
                  src={item.image}
                  alt={item.name}
                  height={80}
                  width={80}
                />
              </div>
              <div className="order-details__itemInfo">
                <span
                  className="order-details__productName"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.name}
                </span>
                <div className="order-details-quantityPrice">
                  <span>x{item.quantity}</span>
                  <span className="primary-color__span">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-details__totalPrice">
          <div className="order-details__containerDiv">
            <div className="div-1">
              <span>Tổng tiền hàng</span>
            </div>
            <div className="div-2">
              <span>
                {calculateTotalItemPrice(selectedOrder).toLocaleString("vi-VN")}{" "}
                ₫
              </span>
            </div>
          </div>
          <div className="order-details__containerDiv">
            <div className="div-1">
              <span>Phí vận chuyển</span>
            </div>
            <div className="div-2">
              <span>
                {selectedOrder.totalPrice > 499000 ? "0" : "40.000"} ₫
              </span>
            </div>
          </div>
          {selectedOrder.discountValue > 0 && (
            <div className="order-details__containerDiv">
              <div className="div-1">
                <span>Voucher giảm giá</span>
              </div>
              <div className="div-2">
                <span>- {selectedOrder.discountValue || 0} ₫</span>
              </div>
            </div>
          )}

          <div className="order-details__containerDiv">
            <div className="div-1">
              <span>Thành tiền</span>
            </div>
            <div className="div-2">
              <span className="mark-span">
                {selectedOrder.totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
          <div className="order-details__containerDiv">
            <div className="div-1">
              <span>Phương thức thanh toán</span>
            </div>
            <div className="div-2">
              <span>
                {selectedOrder.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Tài khoản ngân hàng đã liên kết ví MoMo"}
              </span>
            </div>
          </div>
          <div className="order-details__containerDiv">
            <div className="div-1">
              <span>Trạng thái thanh toán</span>
            </div>
            <div className="div-2">
              <span>
                {selectedOrder.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : selectedOrder ? (
        renderOrderDetails()
      ) : (
        <Tabs defaultActiveKey="1" className="p20">
          {[
            "Tất cả",
            "Chờ xác nhận",
            "Đang xử lý",
            "Chờ giao hàng",
            "Đã giao hàng",
            "Hoàn thành",
            "Đã hủy",
          ].map((label, index) => {
            const statusKeys = [
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "completed",
              "cancelled",
            ];
            return (
              <TabPane tab={label} key={index + 1}>
                {renderOrderList(filterOrdersByStatus(statusKeys[index]))}
              </TabPane>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default MyOrder;
