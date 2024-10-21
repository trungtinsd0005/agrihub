const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { protect } = require('../middleware/authMiddleWare')

router.post('/create', productController.createProduct)
router.put('/update/:id', productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)
router.get('/get-all-type', productController.getAllType)
router.get('/search', productController.getSearchProduct)
router.post('/:id/review', protect, productController.createProductReview);

module.exports = router