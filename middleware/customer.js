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

function validate(course) {

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50)
    };

    return Joi.validate(course, schema);
};