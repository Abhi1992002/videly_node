const validate = (validator) => {

    return (req, res , next) => {
        const {error} = validator(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        next()
    }

}

module.exports = validate


// Now we do not need to add something like this in all routes     const result = schema.validate(req.body)

// if(result.error) return res.send(result.error.details[0].message)
