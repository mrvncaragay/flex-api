const Joi = require('@hapi/joi');


exports.isBodyValid = (req, res, next) => {

    const { error } = validate(req.body);

    if ( error ) {

        res.status(400).send(error.details[0].message);
        return;
    }

    next();
};

function validate(movie) {

    const schema = {
        
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.objectId().required(),
        stock: Joi.number(),
        rate: Joi.number()
    };

    return Joi.validate(movie, schema);
}