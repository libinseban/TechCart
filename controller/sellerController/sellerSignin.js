const Seller = require("../../models/client/seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sellerSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    // Find the seller
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, seller.hashPassword);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const sellerData = {
      _id: seller._id,
      email: seller.email,
    };
    
    const sellerToken = jwt.sign(sellerData, process.env.SELLER_SECRET_KEY, {
      expiresIn: "5d",
    });

    // Set cookies
    res.cookie("sellerToken", sellerToken, { 
      httpOnly: true, 
      secure: true,
      sameSite: 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
    });
    
    res.cookie("sellerId", seller._id.toString(), { 
      httpOnly: true, 
      secure: true,
      sameSite: 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      seller: {
        _id: seller._id,
        email: seller.email,
        name: seller.name
      }
    });

  } catch (error) {
    console.error('Error during seller sign-in:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = sellerSignIn;