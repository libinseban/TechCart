const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product_images', 
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('images'), (req, res) => {
  if (req.images) {
    console.log('Images uploaded successfully:', req.images);
    res.status(200).json({ message: 'Images uploaded successfully', images: req.images });
  } else {
    console.error('Error uploading Image:', error);
    res.status(500).json({ message: 'Error uploading Image', error: error });
  }
});

module.exports = router;
