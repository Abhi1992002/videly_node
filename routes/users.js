const express = require('express');
const router = express.Router();
const {User , validate} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth.js');

const _ = require('lodash')

//i do not need his id , suppose if some other person add different id and then access other people info , so i go this perso info using jwt , come to this endpoint and give me jwt of yours so i can check your information

//onlu authorized person can access it
router.get("/me",auth,async (req,res)=>{
   const user = await  User.findById(req.user._id).select('-password')
   res.send(user);
})

router.post("/",async(req,res)=>{

   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message)

   //now see if user is not already registered 

    let user = await User.findOne({email : req.body.email})

    if(user) return res.status(400).send('User already registered')

    user = new User(_.pick(req.body , ['name' , 'email' , 'password']))

    const salt = await bcrypt.genSalt(10)

   user.password = await bcrypt.hash(user.password,salt)

    await user.save()

    //because i want to send only name and  password to database

    //pick => 1st argument => object , what prop i want , it gives me a new obj

    // const token =  jwt.sign({_id : user._id} , config.get('jwtPrivateKey'))
    //auth and user token same because data and my secret is same here

    //1st arg => name => x-name , second arg => value
    //here we get token and send it to user using header , now they can take it and store it and also logged in using it

    const token = user.generateAuthToken();
    
    res.header("x-auth-token",token).send(_.pick(user , ['_id' , 'name' , 'email'])) 

})

module.exports = router