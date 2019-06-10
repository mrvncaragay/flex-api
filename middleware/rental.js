const Joi = require('@hapi/joi');

exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {

        res.status(400).send(error.details[0].message);
        return;
    }

    next();
}

function validate(rental) {

    const schema = {

        customerId: Joi.string().required(),
        movieId: Joi.string().required()
      };
    
    return Joi.validate(rental, schema);
}