const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require('moment')

const rentalSchema = new mongoose.Schema({
  customer: {
    //Because i need a few prop of customer , that is why i create my own
    type: new mongoose.Schema({
    name:{
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    } ,
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    }),
   required :true
  },

    movie : {
      type : new mongoose.Schema({
          title : {
              type : String,
              required : true ,
              trim : true ,
              minlength: 5,
              maxlength: 255,
          },
          dailyRentalRate:{
              type: Number ,
              required : true,
              min : 0,
              max:255 
          }
          
      }),
      required:true
    },
    dateOut: {
      type : Date ,
       required : true ,
        default : Date.now()
    },
    dateReturned : {
      type : Date 
    },
    rentalFee : {
      type  :Number ,
       min : 0
    }


})

//Add static method 
rentalSchema.statics.lookup = async(customerId , movieId) =>{
 return  await  Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}

//
rentalSchema.methods.return = function(){
  this.dateReturned = new Date()
  
  const rentalDays = moment().diff(this.dateOut,'days')
  this.rentalFee = rentalDays  * this.movie.dailyRentalRate;
}

const Rental = mongoose.model(
  "Rental",
  rentalSchema
);

function validateRental(rental) { 
    const schema = Joi.object({
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    })

    return schema.validate(rental)
}

exports.Rental = Rental;
exports.validate = validateRental ;
