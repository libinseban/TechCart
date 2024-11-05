const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            console.error("No token provided");
            return res.status(401).send("Access Denied. No token provided.");
        }

     
        const verified = jwt.verify(token, process.env.USER_SECRET_KEY);
        req.userId = verified.id; 

        next();
    } catch (error) {
        console.error("Invalid token", error);
        res.status(400).send("Invalid token.");
    }
};

module.exports = authToken;
