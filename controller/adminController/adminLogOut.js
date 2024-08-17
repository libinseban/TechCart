const adminLogout = (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = adminLogout;
