const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false); //remove the deprecated warning
mongoose.set('useCreateIndex', true); //index deprecated warning
mongoose.set('useNewUrlParser', true); //URL deprecated warning


mongoose.connect(process.env.DB)
.then(() => console.log('Connected to test MongoDB...'))
.catch(err => console.error('Cant connect to mongoDb', err));

module.exports = mongoose;