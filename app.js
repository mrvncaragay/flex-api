require('dotenv').config();

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/logs')();
require('./startup/production')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening to port ${port}...`)
});