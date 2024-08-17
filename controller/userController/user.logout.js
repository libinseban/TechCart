const userLogout = (req, res) => {
    res.clearCookie("userToken");
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = userLogout;
