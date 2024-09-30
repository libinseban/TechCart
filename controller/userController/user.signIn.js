const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/client/adminModel");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password", success: false });
    }

    // Check if the user is an admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (isPasswordMatch) {
        const tokenData = {
          _id: admin._id,
          email: admin.email,
          role: 'admin',
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "1d" });

        // Send token in response
        return res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).json({
          success: true,
          message: "Login Successful",
          token: token,
          role: 'admin',
          redirectUrl: "/adminDashboard"
        });
      }
    }

    // Check if the user is a regular user
    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordMatch =  bcrypt.compare(password, user.hashPassword);
      if (isPasswordMatch) {
        const tokenData = {
          _id: user._id,
          email: user.email,
          role: 'user',
        };
        const userToken = jwt.sign(tokenData, process.env.USER_SECRET_KEY, { expiresIn: "5 days" });

        // Send token in response
        return res.cookie("userToken", userToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).json({
          success: true,
          message: "Login Successful",
          token: userToken,
          userId: user._id,
          role: 'user',
          
        });
      }
    }

    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
    });
    
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      message: error.message || "An unexpected error occurred",
      success: false,
    });
  }
}
module.exports = userSignInController;
