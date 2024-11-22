import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createInvoice = async (data) => {
  try {
    const res = await apiClient.post("/invoice/create", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Invoice Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllInvoice = async () => {
  try {
    const res = await apiClient.get("/invoice/get-all");
    return res.data;
  } catch (error) {
    console.error(
      "Get All Invoice Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getInvoiceDetails = async (id) => {
  try {
    const res = await apiClient.get(`/invoice/get-details/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Detail Invoice Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const printInvoice = async (id) => {
  try {
    const res = await apiClient.get(`/invoice/print/${id}`, {
      responseType: "blob",
    });

    console.log("API Response:", res);

    if (res.status !== 200) {
      throw new Error("Failed to fetch invoice PDF");
    }

    const file = new Blob([res.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `invoice_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(fileURL);
    a.remove();

    return res.data;
  } catch (error) {
    console.error(
      "Print Invoice Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
