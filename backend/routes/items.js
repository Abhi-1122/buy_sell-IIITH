const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Item = require('../schemas/item')
const User = require('../schemas/user');

router=express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ stock: true, sellerID: { $ne: req.user.id } });
    // console.log(items);
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).send('Error getting items');
  }
});

router.get('/posted', async (req, res) => {
  try {
    const items = await Item.find({ sellerID: req.user.id,stock:true });
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).send('Error getting items');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    const seller = await User.findById(item.sellerID);
    const itemWithSellerDetails = {
      ...item._doc,
      sellerLoc: seller.location,
      sellerPhone: seller.contact,
    };
    // console.log(itemWithSellerDetails);

    res.json(itemWithSellerDetails);
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).send('Error getting item');
  }
});

router.delete('/:id', async (req, res) => {
      await Item.findByIdAndDelete(req.params.id);
      res.send('Item deleted successfully');
});


const upload = multer({ dest: 'uploads/' });
router.post('/sell', upload.single('image'), async (req, res) => {
  try {
    const seller = await User.findById(req.user.id);
    const sellerName=seller.firstname+" "+seller.lastname;
    const sellerID = req.user.id;
    const { title, price, description, category } = req.body;
    if(req.file){
    const image = fs.readFileSync(req.file.path);
    const base64Image = image.toString('base64');
    const newItem = new Item({
      title,
      price,
      sellerID,
      stock: true,
      category,
      sellerName,
      description,
      image: base64Image,
    });
    await newItem.save();
    fs.unlinkSync(req.file.path);
    }
    else{
      const newItem = new Item({
        title,
        price,
        sellerID,
        stock: true,
        category,
        sellerName,
        description,
      });
      await newItem.save();
    }
    res.status(201).send('Item saved successfully');
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).send('Error saving item');
  }
});

module.exports = router;


