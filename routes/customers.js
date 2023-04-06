const express = require('express');
const router = express.Router();
const {Customer} = require('../models/customer.js')
const Joi = require('joi');

router.get("/",async(req,res)=>{

    //getting genre list from database
    const customer = await Customer.find()

    //after getting list from database , sending list as response
    res.send(customer)
})


router.get("/:id",async(req,res)=>{
    const customer = await Customer.findById(req.params.id)

    // not exist , 404
    if(!customer) return res.status(404).send("id you entered not found")

    //exist , then return him
    return res.send(customer)
})
router.post("/",async(req,res)=>{

    // adding validation on name
        const schema = Joi.object({
            name : Joi.string().min(5).max(50).required(),
            phone : Joi.string().min(5).max(50).required(),
            isGold : Joi.boolean()
        })
    
        const result = schema.validate(req.body)
    
        if(result.error) res.status.send(result.error.details[0].message)
    
    // adding new genre to databaseå    
        let customer = new Customer({  
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        })
    
    // saving that data in database    
        customer =  await customer.save()
    
        res.send(customer) 
    })

    //to update a customer

router.put("/:id", async(req,res)=>{

    // validation
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    })

    const result = schema.validate(req.body)

    if(result.error) return res.send(result.error.details[0].message)


    const customer =  await Customer.findByIdAndUpdate(req.params.id , {name : req.body.name} , {new : true})

    // The new: true option is used to instruct Mongoose to return the updated document after the update has been applied.

    if(!customer) return res.status(404).send("genre not found")

 
    res.send(customer)
})

// to delete  a customer

router.delete("/:id", async(req,res)=>{

   const customer = await  Customer.findByIdAndRemove(req.params.id)

    if(!customer)  res.status(404).send("no id is found")

    res.send(customer)
  

})



    module.exports = router;    