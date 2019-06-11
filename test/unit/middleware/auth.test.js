require('dotenv').config();
const User = require('../../../model/user');
const validator = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {

    it('it should populate req.use with the data of a valid JWT', () => {

        const user = { 
            _id: mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        }

        const token = new User(user).token;
        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        const res = {};
        const next = jest.fn();

        validator.isTokenValid(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});