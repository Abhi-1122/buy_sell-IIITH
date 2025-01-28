const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required: true
    },
    lastname:String,
    email:{
        type:String,
        required:true
    },
    contact:Number,
    location:String,
    password:String
})

module.exports = mongoose.model('user', userSchema);