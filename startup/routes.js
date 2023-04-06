const express = require('express');
const genre = require('../routes/genres.js')
const customers = require('../routes/customers.js')
const home = require('../routes/home.js');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const loggers = require('../middleware/error.js')
const authenticating = require("../middleware/authentication")

const returns = require('../routes/returns');

module.exports = function(app){
    // for request body
app.use(express.json())

//my custom middleware function
// app.use(logger)

app.use(authenticating)


app.use('/api/genres',genre)
app.use('/' , home)
app.use('/api/customers',customers)
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/returns', returns);

//Express error
app.use(loggers)

}