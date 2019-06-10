const Genre = require('../model/genre');

exports.index = async (req, res) => {

    const result = await Genre.find().sort('name');

    if ( !result.length ) return res.send('No genres!');

    res.send(result);   
};

exports.postGenre = async (req, res) => {

    let genre = new Genre({ name: req.body.name });

    await genre.save();

    res.redirect('/api/genres');       
};

exports.updateGenre = async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }) //new here is to get the updated document from db

    if( !genre ) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);    
};

exports.removeGenre = async (req, res, next) => {

    const genre = await Genre.findByIdAndRemove(req.params.id)

    if( !genre ) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
};

exports.getGenre = async (req, res) => {
 
    const genre = await Genre.findById(req.params.id)

    if( !genre ) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
};