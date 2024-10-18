const Seller = require("../../models/client/seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sellerSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    // Find the seller by email
    const seller = await Seller.findOne({ email });
  
    if (!seller) {
      return res.status(400).json({ message: "Seller doesn't exist" });
    }

    const checkPassword = await bcrypt.compare(password, seller.hashPassword);
    if (!checkPassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // If the password is correct, generate a JWT token
    const sellerData = {
      _id: seller._id,
      email: seller.email,
    };
    const sellerToken = jwt.sign(sellerData, process.env.SELLER_SECRET_KEY, {
      expiresIn: "5d",
    });

    localStorage.setItem('sellerId', sellerData._id);

    // Send the token as a cookie and in the response body
    res.cookie("sellerToken", sellerToken, { httpOnly: true, secure: true }).json({
      success: "Login Successful",
      token: sellerToken,
      sellerData
    });

  } catch (error) {
    console.error('Error during seller sign-in:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = sellerSignIn;
