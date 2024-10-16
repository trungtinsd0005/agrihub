import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_KEY,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const createOrder = async(data) => {
    try {
      const res = await apiClient.post('/order/create', data);
      return res.data;
    } catch (error) {
      console.error('Create Order Error:', error.response ? error.response.data : error.message);
      throw error;
    }
};

export const getDetailOrder = async(userId) => {
  try {
    const res = await apiClient.get(`/order/get-detail/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Get Detail Order Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllOrder = async() => {
  try {
    const res = await apiClient.get('/order/get-all');
    return res.data;
  } catch (error) {
    console.error('Get All Order Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateOrderStatus = async (id, data) => {
  try {
      const res = await apiClient.put(`/order/update-status/${id}`, data);
      return res.data;
  } catch (error) {
      console.error('Update Order Status Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};
