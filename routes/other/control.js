const express = require('express');
const pendingSellers = express.Router();
const Seller = require('../../models/client/seller');


pendingSellers.get('/pending', async (req, res) => {
    try {
        const pendingSellers = await Seller.find({ isApproved: false });

        if (pendingSellers.length === 0) {
            return res.json({ message: "There are no pending sellers" });
        }
        res.json(pendingSellers);
    } catch (error) {
        console.error('Error fetching pending sellers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


pendingSellers.put('/:sellerId', async (req, res) => {
    const { sellerId } = req.params;
    console.log(sellerId)
    try {
        await Seller.findByIdAndUpdate(sellerId, { isApproved: true });
        res.status(200).json({ message: 'Seller approved successfully' });
    } catch (error) {
        console.error('Error approving seller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = pendingSellers;
