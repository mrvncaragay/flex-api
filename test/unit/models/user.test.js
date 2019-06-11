require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../../model/user')
const jwt = require('jsonwebtoken');

describe('user.generateAuthToken', () => {
    
    it('should return a valid JWT', () => {

        const data = { 

            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        };

        const user = new User(data);
        const token = user.token;
        const decoded = jwt.verify(token, process.env.JWT);

        expect(decoded).toMatchObject(data);
    })
});