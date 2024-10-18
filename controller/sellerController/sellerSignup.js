const Seller = require("../../models/client/seller");
const bcrypt = require("bcryptjs");

const sellerSignUp = async (req, res) => {
  const { name, email, password, address, phoneNumber } = req.body;

  try {
    // Check if all fields are provided
    if (!name || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    // Check if the seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new seller
    const newSeller = new Seller({
      name,
      email,
      hashPassword,
      address,
      phoneNumber,
    });

    await newSeller.save();
    res.status(201).json({success: "Seller registered successfully",newSeller });
  } catch (error) {
    console.error('Error during seller sign-up:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = sellerSignUp;
