const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    const { file } = req;

    if (file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Failed to upload image to Cloudinary" });
          }

          res.json({ url: result.secure_url });
        }
      );

      result.end(file.buffer);
    } else {
      res
        .status(400)
        .json({ message: "Không có hình ảnh được tải lên để cập nhật" });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Không thể tải hình ảnh lên" });
  }
};

module.exports = { uploadImage };
