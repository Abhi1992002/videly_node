let server ;
const { iteratee } = require('lodash');
const mongoose  = require('mongoose');
const request = require('supertest')
const {Rental} = require('../../models/Rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const moment = require('moment');

describe('/api/returns' , ()=> {

    let customerId
    let movieId
    let rental
    let token 
    let objectSend
    let movie

    beforeEach(async() => {
      server = require("../../index");
      customerId = new mongoose.Types.ObjectId()
      movieId = new mongoose.Types.ObjectId()
      token = new User().generateAuthToken()
      objectSend = {customerId , movieId}

    //   for testing movie stock , firstly i create a movie 
       movie = new Movie({
       _id:movieId , 
       title:'12345',
       dailyRentalRate:2,
       genre: { name : '12345'},
       numberInStock: 10 
       })
       movie.save()

// you know why we create it => because we need some movie to be rented before return      
       rental = new Rental({
        customer : {
            _id: customerId,
            name:'12345',
            phone:'12345'
        },
        movie:{
           _id: movieId,
           title:'12345',
           dailyRentalRate: 2
        }
      })
       
      await rental.save()
      
    });

    const exec = ()=>{
      return  request(server)
        .post('/api/returns')
        .set('x-auth-token',token)
        .send(objectSend)
    }
  

    afterEach(async () => {
      await server.close();
      await Rental.deleteMany({})
      await Movie.deleteMany({})
    });

    it('should return 401 if client is not logged in',async()=>{
        token = ''
        const res = await exec()

        expect(res.status).toBe(401)

    })

    it('should return 400 if customerId is not given',async()=>{

        objectSend = {movieId}
        const res = await exec()
        expect(res.status).toBe(400)

    })

    it('should return 400 if movieId is not given',async()=>{
    
        objectSend = {customerId}
      const res = await exec()
     expect(res.status).toBe(400)

    })

    it('should return 404 if no combination of this customer and movie',async()=>{

    // suppose this comnination is not present in database , then 404 , if there is no rents then it doenot have any comnination then it show errro    
         
    await Rental.deleteMany({}) 

    const res = await exec()

    expect(res.status).toBe(404)


    })

    it('should return 400 if customer already returned ',async()=>{
                   
    rental.dateReturned =  Date.now()
    await rental.save()

    const res = await exec()

    expect(res.status).toBe(400)

    })

    it('should return 200 if valid request ',async()=>{
                   
    const res = await exec()

    expect(res.status).toBe(200)

    })

    it('should set the return date if input is valid',async()=>{
                   
    const res = await exec()
    
    const rentalInDB = await Rental.findById(rental._id)

    const diff =  new Date() - rentalInDB.dateReturned;

    expect(diff).toBeLessThan(10*1000)

    //if we do something like that
    // we post return req => in database current date add 
    // expect(rentalInDB.dateReturned).toBe(new Date()) => it failed because adding in database and testing have a time difference of max 10 sec

    })

    it('should calculate correct rental fee',async()=>{
                   
    // we need to take a rental movie for atleast 1 day ,
    //dateOut => set to current time by mongoose   
    //if you work with date and time use moment 
    
    rental.dateOut = moment().add(-7 , 'days').toDate() //this gives a moment 7 days before , moment for current time , toDate() => to set it into Date format

    await rental.save()
    
    const res = await exec()
    
    const rentalInDB = await Rental.findById(rental._id)

    expect(rentalInDB.rentalFee).toBe(14)

    })

    it('should increase the moviestock',async()=>{
  
    const res = await exec()
    
    const movieInDB = await Movie.findById(movieId)

    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1)
    })

    it('should return the rental',async()=>{
  
    const res = await exec()
  
    const rentalById = await Rental.findById(rental._id)


    expect(res.body).toHaveProperty('dateOut')
    expect(res.body).toHaveProperty('dateReturned')
    expect(res.body).toHaveProperty('rentalFee')
    expect(res.body).toHaveProperty('customer')
    expect(res.body).toHaveProperty('movie')
    })


})