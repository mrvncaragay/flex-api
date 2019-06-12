const Joi = require('@hapi/joi');

exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);
    
    if ( error ) {
      
        res.status(400).send(error.details[0].message);
        return;
    }

    next();
}

function validate(user) {

    const schema = {

        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(10).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
      };
    
    return Joi.validate(user, schema);
}