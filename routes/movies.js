const { validateObjectId, isBodyValid } = require('../middleware/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const movie = require('../controller/movies');

router.get('/', movie.index);
router.get('/:id', validateObjectId, movie.getMovie);
router.post('/', auth.isTokenValid, isBodyValid, movie.postMovie);
router.put('/:id', auth.isTokenValid, [ validateObjectId, isBodyValid ], movie.updateMovie);
router.delete('/:id', [ auth.isTokenValid, admin.isAdmin ], validateObjectId, movie.removeMovie);

module.exports = router;