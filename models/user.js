const Joi = require('joi');
const mongoose = require('mongoose');
const passwordComplexity = require("joi-password-complexity");
const jwt = require('jsonwebtoken')
const config = require('config')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255,
        unique:true,
        sparse:true,

        //use unique with sparse
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255,
    },
    isAdmin:Boolean

})

userSchema.methods.generateAuthToken = function(){
    const token =  jwt.sign({_id : this._id , isAdmin:this.isAdmin} , config.get('jwtPrivateKey'))
    return token    
}

const User = mongoose.model('User', userSchema)

function validateUser(user){
    const schema = Joi.object({
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(50).required().email(),
        password : Joi.string().min(5).max(50).required(),
    })
    // passwordComplexity().validate(user.password)
    return schema.validate(user)
}



exports.User = User;
exports.validate =  validateUser