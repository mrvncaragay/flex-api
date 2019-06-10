const validator = require('../middleware/genres');
const express = require('express');
const router = express.Router();

const genre = require('../controller/genres')

router.get('/', genre.index);
router.post('/', validator.isBodyValid, genre.postGenre);
router.put('/:id', validator.isBodyValid, genre.updateGenre);
router.delete('/:id', genre.removeGenre);
router.get('/:id', genre.getGenre)

module.exports = router;