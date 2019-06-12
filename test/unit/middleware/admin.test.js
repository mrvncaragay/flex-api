require('dotenv').config();
const User = require('../../../model/user');
const admin = require('../../../middleware/admin');
const mongoose = require('mongoose');

describe('admin middleware', () => {

    it('it should return next if user is an admin', () => {

        const user = { 
            _id: mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        }

        const req = {
            user: user
        };

        const res = {};

        const next = jest.fn();
        admin.isAdmin(req, res, next); 
    });   
});