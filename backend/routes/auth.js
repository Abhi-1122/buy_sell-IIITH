const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const axios = require('axios');
const xml2js = require('xml2js');

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, contact, location, password, captcha } = req.body;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        // console.log(captcha)
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
        const Response = await axios.post(googleVerifyUrl);
        // console.log(Response.data);
        if(!Response.data.success) {
            return res.status(400).json({ message: 'Captcha verification failed' });
        }
        // console.log(req.body)
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            // console.log('User already exists')
            // console.log(existinguser)
            return res.status(400).json({ message: 'Please Log In! User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        // console.log(password)
        // console.log(hashedpassword)
        const newuser = new User({ firstname, lastname, email, contact, location, password: hashedpassword });
        await newuser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        const existinguser = await User.findOne({ email });
        if (!existinguser) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // console.log(existinguser)
        const ispasswordcorrect = await bcrypt.compare(password, existinguser.password);
        if (!ispasswordcorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, process.env.JWT_SECRET);
        res.status(200).json({ result: existinguser, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.get('/cas', async (req, res) => {
    // console.log('CAS login');
    const ticket = req.query.ticket;
    // console.log(ticket);
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    };
    const serviceURL = `${process.env.FRONTEND_URL}/auth/cas`;
    const casValidationURL = `https://login.iiit.ac.in/cas/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${encodeURIComponent(serviceURL)}`;
    const response = await axios.get(casValidationURL);
    const xmlData = response.data;
    // console.log(xmlData);
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, async (err, result) => {
        if (err) {
            console.log(err);
        }
        const serviceResponse = result['cas:serviceResponse'];
        const authSuccess = serviceResponse?.['cas:authenticationSuccess'];
        // console.log(authSuccess)
        if (authSuccess) {
            // console.log(result['cas:serviceResponse']['cas:authenticationSuccess']['cas:user']);
            // console.log(result['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']['cas:FirstName']);
            // console.log(result['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']['cas:LastName']);
            const email = result['cas:serviceResponse']['cas:authenticationSuccess']['cas:user'];
            const existinguser = await User.findOne({ email });
            if (existinguser) {
                const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, process.env.JWT_SECRET);
                return res.status(200).json({ token });
            }
            const firstname = result['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']['cas:FirstName'];
            const lastname = result['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']['cas:LastName'];
            const contact = 9999999999;
            const location = 'IIITH';
            const password = generateRandomPassword();
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(password, salt);
            const newuser = new User({ firstname, lastname, email, contact, location, password: hashedpassword });
            const savedUser = await newuser.save();
            const token = jwt.sign({ email: savedUser.email, id: savedUser._id }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        }
        else {
            res.status(400).send("Authentication Failed")
        }
    });
});

module.exports = router;