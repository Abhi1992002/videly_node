const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {Rental} =  require('../models/rental')

const {Movie} = require('../models/movie')
const Joi = require('joi')
const validate = require('../middleware/validate')


router.post("/",[auth , validate(validateReturn)],async(req,res)=>{  

    //there are 2 types of method of Class
    //static  => Rental.lookup , when we are not working with particular object , we add static method to rental object , so go to Rental class and add it 
    //instance => new User().generateAuthToken() , use when we are working with a object and result depend upon that object

    //Previous 
    // const rental = await  Rental.findOne({
    //     'customer._id': req.body.customerId,
    //     'movie._id': req.body.movieId
    // })

    //after static method
    const rental  = await Rental.lookup(req.body.customerId , req.body.movieId)

// -------------------------------

    if(!rental) return res.status(404).send('no rental found')

    if(rental.dateReturned) return res.status(400).send('already returned')

    // this.dateReturned = new Date()
  
    // const rentalDays = moment().diff(this.dateOut,'days')
    // this.rentalFee = rentalDays  * this.movie.dailyRentalRate;

    //we talked about Information Expert Principal 
    //all above 3 lines are based on rental state , so we write these in rental one

    rental.return()

    await rental.save()

   
    await Movie.updateOne({_id: rental.movie._id} , {
        $inc:{ numberInStock : 1 }
    })

    return res.status(200).send(rental)

})

function validateReturn(req){
    const schema = Joi.object({
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    })
    return schema.validate(req)
}


module.exports = router;
