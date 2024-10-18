const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_SECRET_KEY; 

const adminToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token; 

    if (!token) {
      return res.status(403).json({
        message: 'No token provided',
        success: false,
        error: true
      });
    }

 
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid token',
          success: false,
          error: true
        });
      }

      req.admin = decoded;
      next();
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || err,
      success: false,
      error: true
    });
  }
};

module.exports = adminToken;
