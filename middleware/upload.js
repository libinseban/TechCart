const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const cloudinaryData = (req, res, next) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'e-commerce_pics',
    },
  });

  const upload = multer({ storage: storage });
  upload.single('file')(req, res, next); 
};

module.exports = cloudinaryData;
