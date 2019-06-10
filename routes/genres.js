const validator = require('../middleware/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const genre = require('../controller/genres')

router.get('/', genre.index);
router.post('/', auth.isTokenValid, validator.isBodyValid, genre.postGenre);
router.put('/:id', auth.isTokenValid, validator.isBodyValid, genre.updateGenre);
router.delete('/:id', [ auth.isTokenValid, admin.isAdmin ], genre.removeGenre);
router.get('/:id', genre.getGenre)

module.exports = router;