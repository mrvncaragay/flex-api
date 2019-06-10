const Joi = require('@hapi/joi');

exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {

        res.status(400).send(error.details[0].message);
        return;
    }

    next();
};

//Unused
exports.isParamValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {

        res.status(400).send(error.details[0].message);
        return;
    }

    next();
}

function validate(course) {

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50)
    };

    return Joi.validate(course, schema);
}