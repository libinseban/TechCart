const express = require("express");
const productImage = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productImages',  
        format: async (req, file) => 'png', 
        public_id: (req, file) => file.originalname, 
    },
});

const upload = multer({ storage: storage }).array('productImages', 5);

productImage.use('/', upload, (req, res, next) => {
    if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map(file => file.path);  
        console.log('Images uploaded successfully:', uploadedImages);       
        req.uploadedImages = uploadedImages; 
        next(); 
    } else {
        console.error('Error uploading images');
        return res.status(500).json({ message: 'Error uploading images' });
    }
});

module.exports = productImage;
