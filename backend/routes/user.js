const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        // console.log(req.user);
        const user = await User.findById(req.user.id);
        // console.log(user)
        if (!user) {
            return res.status(404).send('User not found');
        }

        // console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user details');
    }
});

router.put('/', async (req, res) => {
    // console.log(req.body);
    // console.log(req.user);
    try {
        // Validate that id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).send('Invalid user ID');
        }
        if(req.body.password===''){
            const user = await User.findById(req.user.id);
            req.body.password = user.password;
        }
        else{
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(password, salt);
            req.body.password = hashedpassword;
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user details');
    }
});


module.exports = router;
