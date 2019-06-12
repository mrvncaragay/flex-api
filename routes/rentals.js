const { validateObjectId, isBodyValid } = require('../middleware/rental');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const rental = require('../controller/rentals');

router.get('/', rental.index);
router.get('/:id', auth.isTokenValid, validateObjectId, rental.getRental);
router.post('/', auth.isTokenValid, isBodyValid, rental.postRental);

module.exports = router;