import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WrapperBgColorComponent from "../../components/WrapperBgColorComponent/WrapperBgColorComponent";
import BreadcrumbComponent from "../../components/BreadcrumbComponent/BreadcrumbComponent";
import "./ProfilePage.scss";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  HeartOutlined,
  CommentOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { updateUser, getDetailUser } from "../../services/UserService";
import {
  getDetailOrder,
  cancelOrder,
  confirmOrderReceived,
  updatePaymentMethod,
} from "../../services/OrderService";
import { createMoMo } from "../../services/PaymentService";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart, addToCart } from "../../redux/slides/cartSlide";
import Info from "../ProfileTabs/Info";
import MyOrder from "../ProfileTabs/MyOrder";
import { Row, Col, Button, message, Modal } from "antd";
import MyVoucher from "../ProfileTabs/MyVoucher";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //Info Handle
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const details = await getDetailUser(userId);
          setUserData(details.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.error("User ID not found in localStorage");
      }
    };
    fetchUserDetails();

    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCityData(response.data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };
    fetchCityData();
  }, [userId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: (data) => {
      message.success("User updated successfully");
      queryClient.invalidateQueries(["userDetails", userId]);
      window.location.reload();
    },
    onError: (error) => {
      message.error("Failed to update user");
      console.error(error);
    },
  });

  const handleCityChange = (cityName) => {
    const selectedCity = cityData.find((city) => city.Name === cityName);
    if (selectedCity) {
      setDistrictData(selectedCity.Districts);
      setWardData([]);
    }
  };

  const handleDistrictChange = (districtName) => {
    const selectedDistrict = districtData.find(
      (district) => district.Name === districtName
    );
    if (selectedDistrict) {
      setWardData(selectedDistrict.Wards);
    }
  };

  const handleSubmit = (values) => {
    const updatedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      address: {
        province: values.province,
        district: values.district,
        ward: values.ward,
        street: values.street,
      },
    };
    mutate(updatedData);
  };

  //Order Handle
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success("Đơn hàng đã được hủy");
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng");
    }
  };

  const handleMoMoPayment = async (orderData) => {
    try {
      const paymentResponse = await createMoMo({
        amount: orderData.totalPrice,
        idOrder: orderData.idOrder,
      });
      console.log("Payment initiated:", paymentResponse);
    } catch (error) {
      console.error("Error initiating MoMo payment", error);
    }
  };

  const handleChangePaymentMethod = async (id) => {
    try {
      const newPaymentMethod = prompt(
        "Nhập phương thức thanh toán mới (momo hoặc cod):"
      );
      if (newPaymentMethod === "momo" || newPaymentMethod === "cod") {
        await updatePaymentMethod(id, newPaymentMethod);
        message.success("Đơn hàng đã đổi phương thức thanh toán thành công");
      } else {
        message.error("Phương thức thanh toán không hợp lệ!");
      }
    } catch (error) {
      message.error("Đổi phương thức thanh toán thất bại");
    }
  };

  const handleReview = (orderItem) => {
    if (orderItem.length === 1) {
      const item = orderItem[0];
      navigate(`/product/${item.id}`);
    } else {
      setSelectedProduct(orderItem);
      setIsModalVisible(true);
    }
  };

  const handleProductSelect = (productId) => {
    setIsModalVisible(false);
    navigate(`/product/${productId}`);
  };

  const renderReviewModal = () => (
    <Modal
      title="Chọn sản phẩm để đánh giá"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {selectedProduct &&
        selectedProduct.map((item) => (
          <div key={item.id} className="container_choseReviewProduct">
            <Button
              className="button_choseReviewProduct"
              onClick={() => handleProductSelect(item.id)}
            >
              <span>{item.name}</span>
            </Button>
          </div>
        ))}
    </Modal>
  );

  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleConfirmReceived = async (orderId) => {
    try {
      await confirmOrderReceived(orderId);
      message.success("Đơn hàng đã được xác nhận nhận hàng thành công");
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng");
    }
  };

  const handleRepurchase = (orderItems) => {
    orderItems.forEach((item) => {
      const itemWithQuantity = { ...item };
      dispatch(addToCart(itemWithQuantity));
    });
    navigate("/cart");
  };

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const orders = await getDetailOrder(userId);
          setOrderData(orders.data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      } else {
        console.error("No userId found in localStorage");
      }
    };

    fetchOrderDetails();
  }, [orderData]);

  //Default Handle
  const handleLogoutUser = () => {
    dispatch(clearCart());
    localStorage.removeItem("userId");
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("selectedProducts");
    navigate("/");
    window.location.reload();
  };

  const breadcrumbs = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản của tôi" },
  ];

  const [activeTab, setActiveTab] = useState("info");

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <Info
            userData={userData}
            cityData={cityData}
            districtData={districtData}
            wardData={wardData}
            handleSubmit={handleSubmit}
            handleCityChange={handleCityChange}
            handleDistrictChange={handleDistrictChange}
            isLoading={isLoading}
          />
        );
      case "orders":
        return (
          <MyOrder
            orderData={orderData}
            handleCancelOrder={handleCancelOrder}
            handleConfirmReceived={handleConfirmReceived}
            handleRepurchase={handleRepurchase}
            handleReview={handleReview}
            handleChangePaymentMethod={handleChangePaymentMethod}
            handleMoMoPayment={handleMoMoPayment}
          />
        );

      case "vouchers":
        return <MyVoucher />;
      case "favorites":
        return <div>Sản phẩm yêu thích</div>;
      case "reviews":
        return <div>Nhận xét của tôi</div>;
      case "notifications":
        return <div>Thông báo của tôi</div>;
      default:
        return null;
    }
  };

  return (
    <WrapperBgColorComponent>
      <BreadcrumbComponent breadcrumbs={breadcrumbs} />
      <div className="container">
        <Row>
          <Col span={6}>
            <div className="widget p10 mr20">
              <div className="uname">
                <span className="t1 medium">Tài khoản</span>
                <span className="t2 semi-bold">{userData?.name}</span>
                <span className="t1">{userData?.email}</span>
              </div>
              <div className="menu-account">
                <div
                  onClick={() => setActiveTab("info")}
                  className={activeTab === "info" ? "active-tab" : ""}
                >
                  <UserOutlined /> Thông tin của tôi
                </div>
                <div
                  onClick={() => setActiveTab("orders")}
                  className={activeTab === "orders" ? "active-tab" : ""}
                >
                  <ShoppingCartOutlined /> Đơn hàng của tôi
                </div>
                <div
                  onClick={() => setActiveTab("vouchers")}
                  className={activeTab === "vouchers" ? "active-tab" : ""}
                >
                  <DollarOutlined /> Voucher của tôi
                </div>
                <div
                  onClick={() => setActiveTab("favorites")}
                  className={activeTab === "favorites" ? "active-tab" : ""}
                >
                  <HeartOutlined /> Sản phẩm yêu thích
                </div>
                <div
                  onClick={() => setActiveTab("reviews")}
                  className={activeTab === "reviews" ? "active-tab" : ""}
                >
                  <CommentOutlined /> Nhận xét của tôi
                </div>
                <div
                  onClick={() => setActiveTab("notifications")}
                  className={activeTab === "notifications" ? "active-tab" : ""}
                >
                  <BellOutlined /> Thông báo của tôi
                </div>
                <div>
                  <a href="/" onClick={handleLogoutUser}>
                    <LogoutOutlined /> Đăng xuất
                  </a>
                </div>
              </div>
            </div>
          </Col>
          <Col span={18}>
            <div className="box">
              {renderContent()}
              {renderReviewModal()}
            </div>
          </Col>
        </Row>
      </div>
    </WrapperBgColorComponent>
  );
};

export default ProfilePage;
