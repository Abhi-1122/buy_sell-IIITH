const express = require('express');
const router = express.Router();
const Order = require('../schemas/order');
const Item = require('../schemas/item');
const User = require('../schemas/user');

router.get('/buy', async (req, res) => {
    try {
        const orders = await Order.find({ buyerID: req.user.id });
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const item = await Item.findById(order.itemID);
            return {...item._doc, status:order.status,orderID : order._id};
        }));
        res.json(ordersWithItems);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).send('Error getting orders');
    }
});


router.get('/closed', async (req, res) => {
    try {
        const orders = await Order.find({ sellerID: req.user.id, status: 'closed' });
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const item = await Item.findById(order.itemID);
            const buyer = await User.findById(order.buyerID);
            return {...item._doc, status:order.status, buyerName:buyer.firstname+' '+buyer.lastname};
        }));
        res.json(ordersWithItems);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).send('Error getting orders');
    }
});

router.get('/sell', async (req, res) => {
    try {
        const orders = await Order.find({ sellerID: req.user.id, status: 'pending' });
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const item = await Item.findById(order.itemID);
            const buyer = await User.findById(order.buyerID);
            return {...item._doc, status:order.status, buyerName:buyer.firstname+' '+buyer.lastname,orderID : order._id};
        }));
        res.json(ordersWithItems);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).send('Error getting orders');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const item = await Item.findById(order.itemID);
        const buyer = await User.findById(order.buyerID);
        res.json({...item._doc, status:order.status, buyerName:buyer.firstname+' '+buyer.lastname, buyerPhone:buyer.contact, buyerLoc:buyer.location});
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).send('Error getting order');
    }
}
);

module.exports = router;