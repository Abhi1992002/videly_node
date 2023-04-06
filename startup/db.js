const mongoose = require('mongoose');
const config = require('config');

const { createLogger , transports  ,format} = require('winston')
const logger =  createLogger({
    transports:[
        new transports.Console({
            level:'info',
            format : format.combine(format.timestamp() , format.json() , format.colorize({all: true})) 
        }),
        new transports.File({
            filename:'./logs/info.log',
            level:'info',
            format : format.combine(format.timestamp() , format.json()) 
        }),
      ]
})

module.exports = function (){

    // const db = config.get('db')
    const db = process.env.DB
    mongoose.connect(db)
    .then(()=> logger.info(`connected to ${db}...`))

}
