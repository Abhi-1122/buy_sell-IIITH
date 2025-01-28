const mongoose = require('mongoose');
const express = require('express');
const auth = require('./routes/auth');
const cors = require('cors');
const verifyToken = require('./routes/jwtverify');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const getID = require('./middleware/getID');
const itemRoute = require('./routes/items');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/orders');
const otpRoute = require('./routes/otp');

require('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
mongoose.connect('mongodb://127.0.0.1:27017/assignment-1')
.then(() => {console.log('Connected to database')})
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/auth",auth);
app.use('/verify-token',verifyToken);
app.use(getID)
app.use('/user',userRoute);
app.use('/item',itemRoute);
app.use('/cart',cartRoute);
app.use('/orders',orderRoute)
app.use('/otp',otpRoute);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})