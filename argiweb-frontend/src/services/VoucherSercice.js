import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createVoucher = async (data) => {
  try {
    const res = await apiClient.post("/vouchers/create", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Voucher Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const applyVoucher = async (data) => {
  try {
    const res = await apiClient.post("/vouchers/apply", data);
    return res.data;
  } catch (error) {
    console.error(
      "Apply Voucher Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateVoucher = async (code, data) => {
  try {
    const res = await apiClient.put(`/vouchers/update/${code}`, data);
    return res.data;
  } catch (error) {
    console.error(
      "Update Voucher Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteVoucher = async (code) => {
  try {
    const res = await apiClient.delete(`/vouchers/delete/${code}`);
    return res.data;
  } catch (error) {
    console.error(
      "Delete Voucher Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllVouchers = async () => {
  try {
    const res = await apiClient.get("/vouchers/get-all");
    return res.data;
  } catch (error) {
    console.error(
      "Get All Vouchers Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
