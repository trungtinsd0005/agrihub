const express = require('express');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/ImageController')

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;