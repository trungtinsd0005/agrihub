const ProductService = require('../services/ProductService')
const Product = require("../models/ProductModel")


const createProduct = async(req, res) => {
    try {
        const 
        {
            name, 
            image, 
            type, 
            price, 
            countInStock,
            description, 
        } = req.body
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

const getAllType = async(req, res) => {
    try {
        const response = await ProductService.getAllType()
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

const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const user = req.user;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === user.id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        const review = {
            user: user.id,
            name: user.name,
            rating: Number(rating),
            comment: comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailsProduct,
    getAllProduct,
    getAllType,
    getSearchProduct,
    createProductReview
}