const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePic',
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log('File uploaded successfully:', req.file);
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  } else {
   
    console.error('Error uploading file: No file provided');
    res.status(400).json({ message: 'No file provided' });
  }
});

module.exports = router;
