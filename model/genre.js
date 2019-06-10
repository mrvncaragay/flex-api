const mongoose = require('../database')

const Genre = mongoose.model('Genre', new mongoose.Schema({

    name: { 
        type: String, 
        required: true,
        minLength: 5,
        maxlength: 50
    }

}));

module.exports = Genre;