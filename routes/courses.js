const express = require('express');

const router = express.Router();

const course = require('../controller/course')

router.get('/', course.index);


module.exports = router;