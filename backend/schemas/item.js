const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    sellerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    stock:Boolean,
    category:String,
    sellerName:String,
    description:String,
    image:String,
})

module.exports = mongoose.model('item', itemSchema);