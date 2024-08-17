const Seller = require("../../models/client/seller");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide a valid email." });
    }

    const checkSeller = await Seller.findOne({ email });
    if (!checkSeller) {
      return res.status(400).send({ message: "Seller not found, please register." });
    }

    const sellerToken = jwt.sign({ email }, process.env.SELLER_SECRET_KEY, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MY_EMAIL, 
        pass: process.env.MY_PASSWORD
      }
    });

    const receiver = {
      from: "Admin of Tech-Cart",
      to: email,
      subject: "Password Reset Request",
      text: `Thank You for being part of our journey.Click on this link to generate a new password : ${process.env.FRONDEND_URL}/reset-password/${sellerToken}`
    };

    await transporter.sendMail(receiver);
    res.status(200).send({ message: "Password reset link sent successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword,sellerToken } = req.body;

      console.log(sellerToken)
      
    // Verify the token
    const decoded = jwt.verify(sellerToken, process.env.SELLER_SECRET_KEY);

    // Find the Seller by email
    const seller = await Seller.findOne({ email: decoded.email });
    if (!seller) {
      return res.status(400).send({ message: "Seller not found." });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Update the Seller's password
    seller.hashPassword = hashPassword;
    await seller.save();

    res.status(200).send({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { forgetPassword, resetPassword };
