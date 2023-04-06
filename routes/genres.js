const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genre');
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin.js');
const { default: mongoose } = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId')


//To see complete list of genre
router.get("/", async(req,res)=>{
            //getting genre list from database  
            
            
    const genres = await Genre.find()

    //after getting list from database , sending list as response
    res.send(genres)

})

//to see individual genre using id
router.get("/:id",validateObjectId ,async(req,res)=>{

// to check if user give correct id or not , now it is common on all route who need id and make a middleware with this    
   

    const genres = await Genre.findById(req.params.id)

    // not exist , 404
    if(!genres) return res.status(404).send("id you entered not found")

    //exist , then return him
    return res.send(genres)
})

// to create a new genre

router.post("/",auth, async(req,res)=>{

//authectication needed to access it    


// adding validation on name
    const schema = Joi.object({
        name : Joi.string().min(5).max(50).required()
    })

    const result = schema.validate(req.body)

    // if(result.error) res.status(400).send("hello")
    if(result.error) res.status(400).send(result.error.details[0].message)

// adding new genre to databaseå    
    let genres = new Genre({  
        name: req.body.name
    })

// saving that data in database    
    genres =  await genres.save()

    res.send(genres) 
})

//to update a genre

router.put("/:id",async(req,res)=>{

    // validation
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    })

    const result = schema.validate(req.body)

    if(result.error) return res.send(result.error.details[0].message)


    const genre =  await Genre.findByIdAndUpdate(req.params.id , {name : req.body.name} , {new : true})

    // The new: true option is used to instruct Mongoose to return the updated document after the update has been applied.

    if(!genre) return res.status(404).send("genre not found")

 
    res.send(genre)
})

// to delete  a genre

router.delete("/:id",[auth, admin],async(req,res)=>{

  
        const id = req.params.id.trim();
        const genre = await Genre.findByIdAndRemove(id);
    
        if (!genre) return res.status(404).send("No ID is found");
    
        res.send(genre);
 
      
    });

module.exports = router;