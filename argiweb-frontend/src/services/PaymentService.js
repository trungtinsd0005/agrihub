import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createMoMo = async (data) => {
  try {
    const res = await apiClient.post("/payment/createMoMo", data);
    if (res.data && res.data.payUrl) {
      console.log("Redirecting to MoMo payment URL:", res.data.payUrl);
      window.location.href = res.data.payUrl;
    } else {
      console.error("No payUrl returned from server");
    }
    return res.data;
  } catch (error) {
    console.error(
      "Create Payment Method MOMO Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
