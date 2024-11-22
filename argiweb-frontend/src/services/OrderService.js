import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createOrder = async (data) => {
  try {
    const res = await apiClient.post("/order/create", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Order Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getDetailOrder = async (userId) => {
  try {
    const res = await apiClient.get(`/order/get-detail/${userId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Detail Order Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getDetailOrderByOrderId = async (orderId) => {
  try {
    const res = await apiClient.get(`/order/get-detail-order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Detail Order by OrderID Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllOrder = async () => {
  try {
    const res = await apiClient.get("/order/get-all");
    return res.data;
  } catch (error) {
    console.error(
      "Get All Order Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getRevenueStats = async () => {
  try {
    const res = await apiClient.get("/order/get-revenue");
    return res.data;
  } catch (error) {
    console.error(
      "Get Revenue Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateOrderStatus = async (id, data) => {
  try {
    const res = await apiClient.put(`/order/update-status/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const cancelOrder = async (id) => {
  try {
    const res = await apiClient.put(`/order/cancel/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Cancel Order Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const confirmOrderReceived = async (id) => {
  try {
    const res = await apiClient.put(`/order/confirm-received/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Confirm Order Received Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updatePaymentMethod = async (id, newPaymentMethod) => {
  try {
    const res = await apiClient.patch(`/order/update-payment-method/${id}`, {
      newPaymentMethod,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Update Payment Method Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
