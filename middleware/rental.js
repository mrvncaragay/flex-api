const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {

        res.status(400).send(error.details[0].message);
        return;
    }

    next();
};

exports.validateObjectId = (req, res, next) => {

    if( !mongoose.Types.ObjectId.isValid(req.params.id) )
        return res.status(404).send('Invalid Id.');

    next();
};


function validate(rental) {

    const schema = {

        customerId: Joi.string().required(),
        movieId: Joi.string().required()
      };
    
    return Joi.validate(rental, schema);
};