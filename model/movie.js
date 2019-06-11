const mongoose = require('../startup/database');
const Genre = require('./genre');


const Movie = mongoose.model('Movie', new mongoose.Schema({

    title: { 

        type: String,
        required: true,
        min: 2,
        max: 50,
        trim: true
     },
     
    genre: { 

        type: Genre.schema,
        required: true 
    },
    
    numberInStock: { 

        type: Number,
        required: true
     },

    dailyRentalRate: { 

        type: Number,
        required: true
     }

}));

module.exports = Movie;