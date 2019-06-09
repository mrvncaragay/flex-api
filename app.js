const express = require('express');
const bodyParser = require('body-parser');
const courses = require('./routes/courses');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(courses);


const port = process.env.PORT || 8080;
app.listen(port);