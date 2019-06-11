const validator = require('../middleware/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const movie = require('../controller/movies');

router.get('/', movie.index);
router.get('/:id', validator.validateObjectId, movie.getMovie);
router.post('/', auth.isTokenValid, validator.isBodyValid, movie.postMovie);
router.put('/:id', auth.isTokenValid, validator.isBodyValid, movie.updateMovie);
router.delete('/:id', auth.isTokenValid, movie.removeMovie);

module.exports = router;