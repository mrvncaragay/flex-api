//const mongoose = require('mongoose');
const Movie = require('../model/movie');
const Customer = require('../model/customer');
const Rental = require('../model/rental');
//const Fawn = require('fawn');

//Fawn.init(mongoose); //Transaction - Two Phase Commit

exports.index = ('/', async (req, res) => {
    
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
  });
  
exports.postRental = ('/', async (req, res) => {

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');
  
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');
  
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({ 

        customer: {

            _id: customer._id,
            name: customer.name, 
            phone: customer.phone
        },

        movie: {

            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    rental = await rental.save();
    movie.numberInStock--;
    movie.save();

    res.send(rental);

    // For Transaction in mongodb
    // new Fawn.Task()
    //     .save('rentals', rental)
    //     .update('movies', { _id: movie._id }, {
    //         $inc: { numberInStock: -1 }
    //     })
    //     .run();
});
  
exports.getRental = ('/:id', async (req, res) => {

    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});