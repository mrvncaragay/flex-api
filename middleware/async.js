//const asyncMiddleware = require('../middleware/async'); if we dont use express-async-errors
module.exports = function (handler) {

    return async (req, res, next) => {
        try {
            
            await handler(req, res);

        } catch (error) {

            next(error);
        }
    }
};