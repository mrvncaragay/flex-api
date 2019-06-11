const { isBodyValid, validateObjectId } = require('../middleware/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const genre = require('../controller/genres')

router.get('/', genre.index);
router.post('/', auth.isTokenValid, isBodyValid, genre.postGenre);
router.put('/:id', auth.isTokenValid, [ validateObjectId, isBodyValid ], genre.updateGenre);
router.delete('/:id', [ auth.isTokenValid, admin.isAdmin ], validateObjectId, genre.removeGenre);
router.get('/:id', validateObjectId, genre.getGenre)

module.exports = router;