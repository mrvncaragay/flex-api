const express = require('express');
const bodyParser = require('body-parser');
const genre = require('./routes/genres');
const customer = require('./routes/customers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/genres', genre);
app.use('/api/customers', customer);


const port = process.env.PORT || 8080;
app.listen(port);