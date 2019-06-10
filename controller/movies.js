const Movie = require('../model/movie');
const Genre = require('../model/genre');

exports.index = async (req, res) => {

    const result = await Movie.find().sort('name');

    if ( !result.length ) return res.send('No movies');

    res.send(result);
};

exports.postMovie =  async (req, res) => {

    try {

        const genre = await Genre.findById(req.body.genreId)
        if (!genre) return res.status(400).send('Invalid genre.');

        const movie = new Movie({ 

            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.stock,
            dailyRentalRate: req.body.rate 
        });

        await movie.save();
        
        if( !movie ) return res.status(404).send('Creating movie list failed.');

        res.status(300).redirect(movie);
        
    } catch (error) {

        return res.status(404).send(error.message);
    }
};

exports.updateMovie = async (req, res) => {

    try {

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');

        const movie = await Movie.findByIdAndUpdate(req.params.id, { 

            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            
            numberInStock: req.body.stock,
            dailyRentalRate: req.body.rate

        }, { 
            new: true 
        });

        if( !movie ) return res.status(404).send('The movie with the given ID was not found.');
     
        res.send(movie);
        
    } catch (error) {
        
        return res.status(404).send(error.message);
    }
};

exports.removeMovie = async (req, res) => {

    try {

        const movie = await Movie.findByIdAndRemove(req.params.id)

        if( !movie ) return res.status(404).send('The movie with the given ID was not found.');

        res.send(movie);
        
    } catch (error) {
        
        return res.status(404).send(error.message);
    }
};

exports.getMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id)

        if( !movie ) return res.status(404).send('The movie with the given ID was not found.');

        res.send(movie);
        
    } catch (error) {

        return res.status(404).send(error.message);
    }
}