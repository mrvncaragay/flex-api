const Joi = require('@hapi/joi');

exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {
        res.status(400).send(error.details[0].message);
        return;
    }

    next();
};

function validate(course) {

    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}