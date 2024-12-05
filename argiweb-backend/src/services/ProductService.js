const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkNameProduct = await Product.findOne({
        name: newProduct.name,
      });
      if (checkNameProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already in use",
        });
      }

      if (newProduct.symptoms && newProduct.type !== "Thuốc trừ bệnh") {
        return resolve({
          status: "ERR",
          message:
            "Cannot add symptoms. Only products of type 'Thuốc trừ bệnh' can have symptoms.",
        });
      }
      const createdProduct = await Product.create(newProduct);
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The Product is not defined",
        });
      }

      if (data.symptoms && checkProduct.type !== "Thuốc trừ bệnh") {
        return resolve({
          status: "ERR",
          message:
            "Cannot update symptoms. Only products of type 'Thuốc trừ bệnh' can have symptoms.",
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      console.log("updateProduct: ", updatedProduct);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });

      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get Detail Product SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};

      if (filter) {
        const label = filter[0];
        query[label] = { $regex: filter[1], $options: "i" };
      }

      const totalProduct = await Product.countDocuments(query);

      let sortQuery = {};
      if (sort) {
        sortQuery[sort[1]] = sort[0] === "asc" ? 1 : -1;
      }

      const allProduct = await Product.find(query).sort(sortQuery);

      resolve({
        status: "OK",
        message: "Get Products SUCCESS",
        data: allProduct,
        totalProduct: totalProduct,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Get Products FAILED",
        error: error.message,
      });
    }
  });
};

const getAllType = (sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Get TYPE Product SUCCESS",
        data: allType,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Get TYPE Products FAILED",
        error: error.message,
      });
    }
  });
};

const getProductByType = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productsByType = await Product.find({ type: type });
      resolve({
        status: "OK",
        message: "Get Products By Type SUCCESS",
        data: productsByType,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Get Products By Type FAILED",
        error: error.message,
      });
    }
  });
};

const getSearchProduct = (keyword, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};

      if (filter) {
        const label = filter[0];
        query[label] = { $regex: filter[1], $options: "i" };
      }

      if (keyword) {
        query["$or"] = [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      }

      const totalProduct = await Product.countDocuments(query);

      let sortQuery = {};
      if (sort) {
        sortQuery[sort[1]] = sort[0] === "asc" ? 1 : -1;
      }

      const searchProduct = await Product.find(query).sort(sortQuery);

      resolve({
        status: "OK",
        message: "Get Search Products SUCCESS",
        data: searchProduct,
        totalProduct: totalProduct,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Get Search Products FAILED",
        error: error.message,
      });
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct,
  getAllType,
  getSearchProduct,
  getProductByType,
};
