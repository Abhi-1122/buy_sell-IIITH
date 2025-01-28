const express = require('express');
const router = express.Router();
const Item = require('../schemas/item');
const Order = require('../schemas/order');

router.post('/', async (req, res) => {
    const items=req.body.items;
    const stockMap = {};
    const dbItems = await Item.find({ _id: { $in: items.map(item => item._id) } });
    dbItems.forEach(dbItem => {
        stockMap[dbItem._id] = dbItem.stock;
    });
    // console.log(items);
    // console.log(stockMap);
    res.send(stockMap);
    });

router.post('/place-order', async (req, res) => {
    const buyer = req.user.id;
    const items = req.body.items;
    const dbItems = await Item.find({ _id: { $in: items.map(item => item._id) } });
    dbItems.forEach(async (dbItem) => {
        const order = new Order({
            buyerID: buyer,
            amount: dbItem.price,
            sellerID: dbItem.sellerID,
            itemID: dbItem._id,
            status: 'pending',
            hashedOTP: null
        });
        const item = items.find(item => item._id === dbItem._id);
        dbItem.stock = false;
        await dbItem.save();
        await order.save();
    });
    res.send('Order placed successfully!');
});

module.exports = router;