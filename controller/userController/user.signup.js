const userModel = require("../../models/client/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CreateCart } = require("../service/cartService");

const userSignUpController = async (req, res) => {
    try {
        const { email, password, firstName, lastName, profilePic } = req.body;

        const findUser = await userModel.findOne({ email });
        if (findUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Please fill out all fields" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

       
        const user = new userModel({
            email,
            hashPassword, 
            firstName,
            lastName,
            profilePic
        });

        const savedUser = await user.save();
        
        const userToken = jwt.sign({ id: savedUser._id }, process.env.USER_SECRET_KEY, { expiresIn: '7 days' });

        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('userToken', userToken, { httpOnly: true, secure: isProduction, sameSite: 'None' });
        res.cookie('userId', savedUser._id.toString(), { httpOnly: true, secure: isProduction, sameSite: 'None' });

        res.status(201).json({
            id: savedUser._id,
            data: savedUser,
            success: "User Created Successfully",
            error: false,
        });

        console.log("User created successfully", savedUser);
    } catch (error) {
        console.error("Error in user sign-up:", error); 
        res.status(500).json({ message: error.message, error: true, success: false });
    }
}

module.exports = userSignUpController;
