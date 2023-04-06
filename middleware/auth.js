const jwt = require('jsonwebtoken');
const config = require('config')

function auth(req,res,next){
    const token = req.header('x-auth-token')

    if(!token) res.status(401).send('Access Denied. No token provided.')

    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'))
        // const decoded = jwt.verify(token,process.env.JWT_PRIVATE_KEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(400).send("invalid token")
    }

}

module.exports = auth