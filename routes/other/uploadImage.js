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

router.use('/', (req, res, next) => {
  upload.single('profilePic')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    if (req.file) {
      req.body.profilePic = req.file.path;
    }

    next();
  });
});


module.exports = router;
