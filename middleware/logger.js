//this middleware called first because it is at top
function log(req,res,next){
    console.log('Logging');
    next();
    // if we not add next => it will not go after this and all this req-res cycle stops
   }

   module.exports = log;