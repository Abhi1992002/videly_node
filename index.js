
const express = require('express');
const app = express();
require('dotenv').config()


require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)




//mongoose

//connecting to mongodb database


const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')

// const logger = require('./middleware/logger.js')

const morgan = require('morgan')


app.set('view engine', 'pug');
app.set('views' , './views' ) //default

// for validation purpose




// Configuration 
// console.log('Application Name : ' + config.get('name'))
// console.log('Mail Server: ' + config.get('mail.host'))

// we want to morgan only for development period

//if(app.get('env') === 'development'){
    //app.use(morgan('tiny'))
  //  startupDebugger('Morgan Enabled')
//}

// DB work.....
//dbDebugger('connected to the database')

// console.log(`NODE_ENV : ${process.env.NODE_ENV}`)

// console.log(`app : ${app.get('env')}`)


const PORT = process.env.PORT || 3008;
const server =  app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})

module.exports = server;
