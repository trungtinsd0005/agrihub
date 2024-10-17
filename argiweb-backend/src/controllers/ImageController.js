const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadImage = async (req, res) => {
    try {
        const { file } = req;

        if (file) {
          // Nếu có file mới (để cập nhật), upload file đó lên Cloudinary
          const result = await cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Để tự động nhận dạng loại file (ảnh, video, v.v.)
            (error, result) => {
              if (error) {
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
              }
    
              // Trả về URL của ảnh đã upload
              res.json({ url: result.secure_url });
            }
          );
    
          // Upload ảnh trực tiếp từ bộ nhớ (buffer)
          result.end(file.buffer); 
        } else {
          // Nếu không có ảnh mới trong body, bạn có thể trả về ảnh cũ hoặc thông báo không thay đổi
          res.status(400).json({ message: 'No image uploaded for update' });
        } 
  
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  };

module.exports = { uploadImage };
