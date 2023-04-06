 function admin(req,res,next){
    //auth => req.user decoded

    //401 unauthorized => try again
    //403 Forbidden => do not try again

    if(!req.user.isAdmin) return res.status(403).send("Access Denied")

    next()
}

module.exports = admin