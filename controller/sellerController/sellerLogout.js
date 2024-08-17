const sellerLogout = (req, res) => {
    res.clearCookie("sellerToken");
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = sellerLogout;
