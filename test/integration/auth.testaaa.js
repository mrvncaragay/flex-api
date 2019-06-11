require('dotenv').config();
const request = require('supertest');
const User = require('../../model/user');
const Genre = require('../../model/genre');
let server;

describe('auth middleware', () => {

    beforeEach(() => { 

        server = require('../../app'); 
    });
    
    afterEach( async () => { 

        await Genre.deleteMany({});
        server.close();
    });

    
    let token;

    const exec = async () => {

        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
    };

    beforeEach(() => { 

        token = new User().token;
    });


    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'invalidtoken'

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
   
        const res = await exec();
        expect(res.status).toBe(200);
    });
});