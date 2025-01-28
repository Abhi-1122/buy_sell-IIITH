const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
    amount:{
        type:Number,
        required:true
    },
    sellerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    itemID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'item',
        required:true
    },
    status:String,
    hashedOTP:String,
})

module.exports = mongoose.model('order', orderSchema);