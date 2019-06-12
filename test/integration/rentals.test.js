require('express-async-errors');
require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const Rental = require('../../model/rental');
const Customer = require('../../model/customer');
const Movie = require('../../model/movie');
const Genre = require('../../model/genre');
const User = require('../../model/user')
let server = require('../../app');


describe('/api/rentals', () => {

    afterEach( async () => { 

        await Rental.deleteMany({});
        await Genre.deleteMany({});
        await Movie.deleteMany({});
        await Customer.deleteMany({});
        await server.close();
    });
        
    describe('GET /', () => {

        let movie;
        let customer;

        beforeEach( async () => {
            
            const genre = new Genre({ name: 'Thriller' });
            await genre.save();

            movie = new Movie({
                title: 'Godzilla',
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: 5,
                dailyRentalRate: 5
            });
            await movie.save();

            customer = new Customer({ 

                name: 'Traver',
                isGold: false,
                phone: '932-513-5123' 
            });

            await customer.save();
        });

        it('should return all rentals', async () => {

            await Rental.insertMany([
                { 
                    customer: {

                        _id: customer._id,
                        name: customer.name, 
                        phone: customer.phone
                    },
            
                    movie: {
            
                        _id: movie._id,
                        title: movie.title,
                        dailyRentalRate: movie.dailyRentalRate
                    }
            
                }
            ]);

            const res = await request(server).get('/api/rentals');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.some(r=> r.movie.title === movie.title)).toBeTruthy();
            expect(res.body.some(r=> r.customer.name === customer.name)).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        let rental1;
        let id;
        let token;

        const exec = async () => {

            return await request(server)
                .get('/api/rentals/' + id)
                .set('x-auth-token', token)
                .send();
        };

        beforeEach( async () => {

           rental1 = new Rental(
                { 
                    customer: {

                        _id: mongoose.Types.ObjectId(),
                        name: 'Traver', 
                        phone: '321-133-1332'
                    },
            
                    movie: {
            
                        _id: mongoose.Types.ObjectId(),
                        title: 'Godzilla',
                        dailyRentalRate: 12
                    }
            
                }
            );

            await rental1.save();
        });

        it('should return 401 if client is not logged in', async () => {

            token = '';

            const res = await exec();
            expect(res.status).toBe(401);
        });


        it('should return 404 if invalid id is passed', async () => {

            token = new User().token;
            id = '1233';
        
            const res = await exec();
            expect(res.status).toBe(404);
        });
        
        it('should return a single rental if valid id is passed', async () => {
            
            token = new User().token;
            id = rental1._id;

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('customer.name', rental1.customer.name);
            expect(res.body).toHaveProperty('movie.title', rental1.movie.title);
        });
    });

    describe('POST /', () => {

    });
});