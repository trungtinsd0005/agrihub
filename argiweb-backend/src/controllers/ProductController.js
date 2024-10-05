const ProductService = require('../services/ProductService')


const createProduct = async(req, res) => {
    try {
        const {name, image, type, price, countInStock, rating, selled, discount, description} = req.body
        if(!name || !image || !type || !price || !countInStock || !description ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(201).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async(req, res) => {
    try {
        const productID = req.params.id
        const data = req.body
        if(!productID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.updateProduct(productID, data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async(req, res) => {
    try {
        const productID = req.params.id
        if(!productID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.deleteProduct(productID)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async(req, res) => {
    try {
        const productID = req.params.id
        if(!productID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productID is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productID)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async(req, res) => {
    try {
        const {sort, filter} = req.query;
        const response = await ProductService.getAllProduct(sort, filter)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getSearchProduct = async (req, res) => {
    try {
        const { keyword, sort, filter } = req.query;
        const response = await ProductService.getSearchProduct(keyword, sort, filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailsProduct,
    getAllProduct,
    getSearchProduct
}