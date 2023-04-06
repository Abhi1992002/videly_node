//here we take a function whuch is our route function , add trycatch block and return the reference to the function because express need reference , he calls itself 

module.exports = function(handler){

    return async (req,res,next)=>{
        try {
            await handler(req,res);
        } catch (error) {
            next(error)
        }
    }

}

