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

router.use('/', upload.single('file'), (req, res,next) => {
  if (req.file) {
    req.body.profilePic = req.file.path;
    next()
  } else {
    console.error('Error uploading file: No file provided');
    res.status(400).json({ message: 'No file provided' });
  }

});

module.exports = router;
