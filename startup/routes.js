require('express-async-errors');
const error = require('../middleware/error')
const bodyParser = require('body-parser');
const genre = require('../routes/genres');
const customer = require('../routes/customers');
const movie = require('../routes/movies');
const rental = require('../routes/rentals');
const user = require('../routes/users');
const auth = require('../routes/auth');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use('/api/auth', auth)
    app.use('/api/users', user);
    app.use('/api/genres', genre);
    app.use('/api/customers', customer);
    app.use('/api/movies', movie);
    app.use('/api/rentals', rental);
    app.use(error.logError);
};