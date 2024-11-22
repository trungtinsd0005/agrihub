import axios from "axios";
import dayjs from "dayjs";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
});

export const getAllProduct = async () => {
  try {
    const res = await apiClient.get("/product/get-all");
    return res.data;
  } catch (error) {
    console.error(
      "Get All Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllType = async () => {
  try {
    const res = await apiClient.get("/product/get-all-type");
    return res.data;
  } catch (error) {
    console.error(
      "Get All Type Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getProductByType = async (type) => {
  try {
    const res = await apiClient.get(`/product/get-by-type/${type}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Type Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getDetailProduct = async (id) => {
  try {
    const res = await apiClient.get(`/product/get-details/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Get Detail Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getSearchProduct = async (keyword_search) => {
  try {
    const res = await apiClient.get(
      `/product/search?keyword=${keyword_search}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Get Search Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchProductCount = async () => {
  try {
    const res = await apiClient.get("/product/get-all");
    return res.data.totalProduct;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
};

export const fetchProductSalesData = async () => {
  try {
    const products = await getAllProduct();
    const productSalesData = products.data
      .map((product) => {
        console.log("products items:", product);
        if (product.selled && product.price) {
          return {
            name: product.name,
            value: product.selled * product.price,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    return productSalesData;
  } catch (error) {
    console.error("Error fetching product Sales Data:", error);
    return 0;
  }
};

export const fetchSlowSellingProducts = async () => {
  try {
    const products = await getAllProduct();
    const currentMonth = dayjs().format("YYYY-MM");
    const sevenDaysAgo = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const slowSellingProducts = products.data
      .filter((product) => {
        const noSalesThisMonth = !product.salesHistory.some(
          (sale) => sale.month === currentMonth && sale.totalCount > 0
        );

        const isNewProduct = dayjs(product.createdAt).isAfter(sevenDaysAgo);

        return noSalesThisMonth && !isNewProduct;
      })
      .map((product) => ({
        name: product.name,
        countInStock: product.countInStock,
        lastSold: product.salesHistory.length
          ? product.salesHistory[product.salesHistory.length - 1].month
          : "Chưa bán sản phẩm nào",
        selled: product.selled,
      }));

    return slowSellingProducts;
  } catch (error) {
    console.error("Error fetching slow-selling products:", error);
    return [];
  }
};

export const createProduct = async (data) => {
  try {
    const res = await apiClient.post("/product/create", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await apiClient.put(`/product/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(
      "Update Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await apiClient.delete(`/product/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createProductReview = async (productId, reviewData) => {
  try {
    const res = await apiClient.post(`/product/${productId}/review`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Create Review Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
