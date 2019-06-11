const jwt = require('jsonwebtoken');
const mongoose = require('../startup/database');

const User = mongoose.model('User', new mongoose.Schema({

    name: {

        type: String,
        required: true,
        min: 5,
        max: 50
    },

    email: {

        type: String,
        unique: true,
        required: true,
        index: true,
        min: 5,
        max: 50
    },

    password: {
        type: String,
        min: 3,
        max: 1024,
        required: true
    },

    isAdmin: Boolean,

    token: {
        type: String,
        get: function () {

            return jwt.sign({ 

                _id: this._id,
                isAdmin: this.isAdmin   
                          
            }, process.env.JWT);
        }
    }
}));

module.exports = User;