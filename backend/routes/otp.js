const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Order = require('../schemas/order');


router.post('/', async (req, res) => {
    const otp = crypto.randomInt(100000, 999999);
    // console.log(req.body)
    const orderId = req.body.orderId;
    // console.log(orderId);
    const order = await Order.findById(orderId);
    // console.log(order);
    const salt = await bcrypt.genSalt(10);
    const otpstring = otp.toString();
    const hashedotp = await bcrypt.hash(otpstring, salt);
    order.hashedOTP = hashedotp;
    await order.save();
    res.json({ otp });
});

router.post('/:id', async (req, res) => {
    // console.log(req.body);
    const otp = req.body.otp;
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    const isMatch = await bcrypt.compare(otp, order.hashedOTP);
    if (isMatch) {
        order.status = 'closed';
        await order.save();
        res.json({ message: 'OTP verified. Item Delivered Successfully :)' });
    } else {
        res.status(200).json({ message: 'Invalid OTP! Please Try Again' });
    }
});

module.exports = router;