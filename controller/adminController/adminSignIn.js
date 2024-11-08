const jwt = require('jsonwebtoken');
const adminModel = require("../../models/client/adminModel");
const bcrypt = require("bcryptjs");



const adminSignIn = async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.send(400).json({message:"email and password required"})
        }

        let admin = await adminModel.findOne({email: adminEmail});
        if (email != admin.email) {
            return res.status(401).json({ message: 'Admin not found.. ' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }


        if (isPasswordValid && admin) {
           
            const tokenData = {
                _id: admin._id,
                email: admin.email,
            };
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
                expiresIn: "1d",
            });
          
res.cookie("access_token", token, { httpOnly: true, secure: true }).json({
    success: "Login Successful",
    token: token,
    redirectUrl: "/adminDashboard" 
});

        }
      
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = adminSignIn;
