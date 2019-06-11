require('dotenv').config();

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/logs')();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`listening to port ${port}...`)
});

module.exports = server;