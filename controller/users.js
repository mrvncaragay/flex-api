const User = require('../model/user');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {

    const user = await User.findById(req.user._id).select('-password');

    res.send(user);
}

exports.postUser = async (req, res) => {

    let user = await User.findOne({ email: req.body.email });

    if( user ) return res.status(400).send('User already registered.');
  
    const hashedPassword = await bcrypt.hash(req.body.password, 12); //hased password
    user = new User({ 

        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    await user.save();

    res.header('x-auth-token', user.token).send({
        name: user.name,
        email: user.email
    });
};