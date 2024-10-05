import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_KEY,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllProduct = async() => {
    try {
      const res = await apiClient.get('/product/get-all');
      return res.data;
    } catch (error) {
      console.error('Get All Product Error:', error.response ? error.response.data : error.message);
      throw error;
    }
};

export const getAllType = async() => {
  try {
    const res = await apiClient.get('/product/get-all-type');
    return res.data;
  } catch (error) {
    console.error('Get All Type Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getDetailProduct = async(id) => {
  try {
    const res = await apiClient.get(`/product/get-details/${id}`);
    return res.data;
  } catch (error) {
    console.error('Get Detail Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const getSearchProduct = async(keyword_search) => {
  try {
    const res = await apiClient.get(`/product/search?keyword=${keyword_search}`);
    return res.data;
  } catch (error) {
    console.error('Get Search Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchProductCount = async() => {
  try {
    const res = await apiClient.get('/product/get-all');
    return res.data.totalProduct;
  } catch (error) {
    console.error('Error fetching product count:', error);
    return 0;
  }
};

export const createProduct = async(data) => {
  try {
    const res = await apiClient.post('/product/create', data);
    return res.data;
  } catch (error) {
    console.error('Create Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProduct = async(id, data) => {
  try {
    const res = await apiClient.put(`/product/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Update Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteProduct = async(id) => {
  try {
    const res = await apiClient.delete(`/product/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error('Delete Product Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};