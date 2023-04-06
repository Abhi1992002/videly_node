const { createLogger , transports  ,format} = require('winston')
// require('winston-mongodb')

function loggers(err, req, res, next) {
  //error
  //warn
  //info
  //verbose
  //debug
  //silly

  const logger = createLogger({
    transports:[

    //   To show error on console  
        new transports.Console({
            level: 'error',
            // i want timeStamp also 
            format : format.combine(format.timestamp())
        }),

      //To store error in file  
        new transports.File({
            filename:'real.log',
            level: 'error',
            format : format.combine(format.timestamp() , format.json())
        }),

      //To store file in mongodb database   
        // new transports.MongoDB({
        //     db : 'mongodb://localhost/vidley',
        //     level:'error',
        //     collection:'error',
         
        //     format : format.combine(format.colorize(),format.timestamp() , format.json()),
        //     options:{
        //         useUnifiedTopology: true
        //     },
           
            
        // }),

       
    ],
    //   rejectionHandlers: [
    //     new transports.File({ filename: './logs/rejections.log',level: 'error',
    //     format : format.combine(format.timestamp() , format.json()) })
    //   ],
    //   exceptionHandlers: [
    //     new transports.File({ filename: './logs/exceptions.log',level: 'error',
    //     format : format.combine(format.timestamp() , format.json()) })
    //   ]

    })

    // logger.exitOnError = true;


logger.error(err.message , err)

if(res) res.status(500).send("something failed");
};

module.exports = loggers 
