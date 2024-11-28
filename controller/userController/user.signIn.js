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

    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (isPasswordMatch) {
        const tokenData = {
          _id: admin._id,
          email: admin.email,
          role: 'admin',
        };
        const adminToken = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "1d" });

        res.cookie("access_token", adminToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
        });

        return res.json({
          success: true,
          message: "Login Successful",
          role: 'admin',
<<<<<<< HEAD
          redirectUrl: "/adminDashboard",
          access_token: adminToken
=======
          redirectUrl: "/admin-dashboard",
          access_token:adminToken
>>>>>>> 30b190c118387e074c1b1a672a21a83e1bf7d88e
        });
      }
    }

    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.hashPassword);
      if (isPasswordMatch) {
        const tokenData = {
          _id: user._id,
          email: user.email,
          role: 'user',
        };
        const userToken = jwt.sign(tokenData, process.env.USER_SECRET_KEY, { expiresIn: "5d" });

        res.cookie("userId", user._id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/'
        });
        res.cookie("userToken", userToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/'
        });

        return res.json({
          success: true,
          message: "Login Successful",
          role: 'user',
          userToken
        });
      }
    }

    return res.status(400).json({
      message: "Email or password is incorrect",
      success: false,
    });

  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
      success: false,
    });
  }
}

module.exports = userSignInController;
