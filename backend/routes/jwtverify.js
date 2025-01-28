const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
        console.log('No token provided');
        return res.status(403).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        // console.log('Token verified');
        res.status(200).json({message: 'Valid Token'})
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Invalid Token' });
    }
});



module.exports = router;