import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (data) => {
  try {
    const res = await apiClient.post("/user/sign-in", data);
    return res.data;
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const signupUser = async (data) => {
  try {
    const res = await apiClient.post("/user/sign-up", data);
    return res.data;
  } catch (error) {
    console.error(
      "Sign up error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await apiClient.put(`/user/update-user/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(
      "Update User error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const res = await apiClient.get("/user/getAllUser");
    return res.data;
  } catch (error) {
    console.error(
      "Get All User Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getDetailUser = async (id) => {
  try {
    const res = await apiClient.get(`/user/get-details/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Detail User:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUserVouchers = async (userId) => {
  console.log("User ID sent to API:", userId);
  try {
    const res = await apiClient.get(`/user/get-vouchers/${userId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get User Vouchers Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchUserCount = async () => {
  try {
    const res = await apiClient.get("/user/getAllUser");
    console.log(res);
    return res.data.data.length;
  } catch (error) {
    console.error("Error fetching user count:", error);
    return 0;
  }
};

export const createUser = async (data) => {
  try {
    const res = await apiClient.post("/user/create", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create User Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await apiClient.delete(`/user/delete-user/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Delete User Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
