require('dotenv').config();

const express = require('express');
const app = express();

require('./startup/logs')();
require('./startup/routes')(app);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`listening to port ${port}...`)
});

module.exports = server;