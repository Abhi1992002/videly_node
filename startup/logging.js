const { createLogger, transports, format } = require("winston");
// require("winston-mongodb");
require('express-async-errors')

module.exports = function() {
  const logger = new createLogger({
    rejectionHandlers: [
      new transports.File({
        filename: "./logs/rejections.log",
        level: "error",
        format: format.combine(format.timestamp(), format.json()),
      }),
      new transports.Console({
        level: "error",
        format: format.combine(format.timestamp(), format.json()),
      }),
      // new transports.MongoDB({
      //   db:'mongodb://localhost/vidley',
      //   level: "error",
      //   format: format.combine(format.timestamp(), format.json()),
      //   collection:'rejected Handler'
      // }),
    ],
    exceptionHandlers: [
      new transports.File({
        filename: "./logs/exceptions.log",
        level: "error",
        format: format.combine(format.timestamp(), format.json()),
      }),
      new transports.Console({
        level: "error",
        format: format.combine(format.timestamp(), format.json()),
      }),
      // new transports.MongoDB({
      //   level: "error",
      //   db:'mongodb://localhost/vidley',
      //   format: format.combine(format.timestamp(), format.json()),
      //   collection:'exception Handler'
      // }),
    ],
  });
};
