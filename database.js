const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false); //remove the deprecated warning

mongoose.connect('mongodb://localhost/flex', { useNewUrlParser: true } )
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Cant connect to mongoDb', err)); 


module.exports = mongoose;