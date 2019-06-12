const express = require('express');
const router =  express.Router();
const validator = require('../middleware/user')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const user = require('../controller/users');

router.get('/me', auth.isTokenValid, user.getUser)
router.post('/', validator.isBodyValid, user.postUser)

module.exports = router;