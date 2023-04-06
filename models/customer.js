const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlenght:50
    },
    isGold:{
        type:Boolean,
        default:false
    },
    phone:{
        type:String,
        required:true,
        minlength:5,
        maxlenght:50
    },
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports.Customer = Customer;