require('express-async-errors');
require('dotenv').config();
const request = require('supertest');
const User = require('../../model/user')
let server = require('../../app');

describe('/api/movies', () => {

    afterEach( async () => { 

        await User.deleteMany({});
        await server.close();
    });

    describe('GET /me', () => {

        let id;
        let user;
        let token;

        const exec = async () => {

            return await request(server)
                .get('/api/users/me')
                .set('x-auth-token', token)
                .send();
        };

        beforeEach( async () => {
            
            user = new User({ 
                name: 'name1',
                email: 'test@yahoo.com',
                password: '123456',
                isAdmin: 'false'
             });
             
             await user.save();
             token = user.token;
        });

        it('should return 401 if client is not logged in', async () => {

            token = '';

            const res = await exec();
            expect(res.status).toBe(401);
        });

        
        it('should return 400 if token is invalid', async () => {

            token = '321';
            
            const res = await exec();
            expect(res.status).toBe(400);
        });


        it('should return 200 if token is valid', async () => {
     
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return current user info', async () => {
     
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('email', user.email);
            expect(res.body).toHaveProperty('name', user.name);
            expect(res.body).toHaveProperty('isAdmin', user.isAdmin);
        });
    });

    describe('POST /', () => {

        let token;
        let name;
        let email;
        let password;

        const exec = async () => {

            return await request(server)
                .post('/api/users')
                .set('x-auth-token', token)
                .send({
                    name: name,
                    email: email,
                    password: password
                });
        };

        beforeEach( async () => {

            name = 'name1';
            email = 'name1@yahoo.com';
            password = '123456';

        });

        it('should return 401 if client is not logged in', async () => {

            token = '';

            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {

            token = '123567';
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 403 if client is not an admin', async () => {
            
            const user = new User({ isAdmin: false })
            token = user.token

            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 400 if title is less than 5 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            name = 'four';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if title is more than 50 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            name = new Array(52).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if email is less than 10 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            email = 't@yo.com';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if email is more than 50 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            email = new Array(45).join('a') + '@yahoo.com'

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less than 5 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            password = '1234';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less than 5 characters', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            password = '1234';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if email exists', async () => {

            const user = new User({ isAdmin: true })
            token = user.token

            const user1 = new User({ 
                name: 'name1',
                email: 'name1@yahoo.com',
                password: '123456',
                isAdmin: 'false'
            });

            await user1.save();

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the user if it is valid.', async () => {

            const res = await exec();

            const user = await User.find({ email: 'name1@yahoo.com' });
         
            expect(user).not.toBeNull();
        });

        it('should return the user if it is valid.', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('email', email);
            expect(res.body).toHaveProperty('name', name);
        });
    });
});