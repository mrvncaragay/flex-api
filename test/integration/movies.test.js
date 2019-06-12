require('express-async-errors');
require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const Movie = require('../../model/movie')
const Genre = require('../../model/genre')
const User = require('../../model/user')
let server = require('../../app');

describe('/api/movies', () => {

    afterEach( async () => { 

        await Movie.deleteMany({});
        await Genre.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {

        it('should return all movies', async () => {

            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            await Movie.insertMany([
                { 
                    title: 'movie1',
                    genre: {
                        _id: genre._id,
                        name: genre.name
                    },
                    numberInStock: 10,
                    dailyRentalRate: 10
                },
                { 
                    title: 'movie2',
                    genre: {
                        _id: genre._id,
                        name: genre.name
                    },
                    numberInStock: 10,
                    dailyRentalRate: 10
                }
            ]);

            const res = await request(server).get('/api/movies');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m => m.title === 'movie1')).toBeTruthy();
            expect(res.body.some(m => m.title === 'movie2')).toBeTruthy();
        });

        it('should return text: No movies! no movies', async () => {

            const res = await request(server).get('/api/movies');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
            expect(res.text).toBe('No movies.');
        });
    });

    describe('GET /:id', () => {
        
        it('should return a single movie if valid id is passed', async () => {

            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const movie = new Movie({ 
                title: 'movie1',
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: 10,
                dailyRentalRate: 10
            });
            await movie.save();

            const res = await request(server).get('/api/movies/' + movie._id );

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', movie.title);
        });

        it('should return 404 if invalid id is passed', async () => {

            const res = await request(server).get('/api/movies/12345');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no movie with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();

            const res = await request(server).get('/api/movies/' + id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let title;
        let genre;
        let stock;
        let rate;
        let id;
        
        const exec = async () => {

            return await request(server)
                .post('/api/movies')
                .set('x-auth-token', token)
                .send({  
                    title: title,
                    genreId: id,
                    stock: stock,
                    rate: rate
                });
        };

        beforeEach( async () => {

            genre = new Genre({ name: 'genre' });
            await genre.save();

            token = new User().token;
            id = genre._id;
            stock = 10;
            rate = 10;
            title = 'movie1'
        });

        it('should return 401 if client is not logged in', async () => {

            token = '';

            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if title is less than 5 characters', async () => {

            title = 'four';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if title is more than 50 characters', async () => {

            title = new Array(52).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genreId is empty', async () => {

            id = '';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genreId is invalid', async () => {

            id = mongoose.Types.ObjectId();

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if stock is empty', async () => {

            stock = '';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if stock less than 0', async () => {

            stock = -1;

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if rate is empty', async () => {

            rate = '';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if rate is less than 0', async () => {

            rate = -1;

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the movie if it is valid.', async () => {

            const res = await exec();

            const movie = await Movie.find({ title: 'movie1' });
         
            expect(movie).not.toBeNull();
        });

        it('should return the movie if it is valid.', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', 'movie1');
        });
    });

    describe('PUT /:id', () => {
        
        let token;
        let genre;
        let stock;
        let rate;
        let id;
        let newTitle;

        const exec = async () => {
          
            return await request(server)
                .put('/api/movies/' + id)
                .set('x-auth-token', token)
                .send({ 

                    title: newTitle,
                    genreId: genre._id,
                    stock: stock,
                    rate: rate
                });
        };

        beforeEach( async () => {

            genre = new Genre({ name: 'genre' });
            await genre.save();

            movie = new Movie({ 
                
                title: 'movie1',
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: 10,
                dailyRentalRate: 10
            
            });
            await movie.save();

            id = movie._id;
            token = new User().token;
            newTitle = 'newMovie1';
            stock = 10;
            rate = 10;
        });

        it('should return 404 if given id is invalid', async () => {

            id = 13;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if given id was not found', async () => {
   
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if given title is less than 5 characters', async () => {
            
            newTitle = 'four';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if given title is more than 50 characters', async () => {
            
            newTitle = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if stock is empty', async () => {

            stock = '';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if stock less than 0', async () => {

            stock = -1;

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if rate is empty', async () => {

            rate = '';

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if rate is less than 0', async () => {

            rate = -1;

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should update movie if input is valid', async () => {
            
            const res = await exec();

            const updatedMovie = await Movie.findById(movie._id);

            expect(updatedMovie.title).toBe(newTitle);
        });

        it('should return the updated movie if input is valid', async () => {
            
            stock = 20;
            rate = 30;
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', newTitle);
            expect(res.body).toHaveProperty('numberInStock', 20);
            expect(res.body).toHaveProperty('dailyRentalRate', 30);
        });
    });

    describe('DELETE /:id', () => {
        
        let token;
        let movie;
        let id;
        let genre;

    
        const exec = async () => {

          return await request(server)
            .delete('/api/movies/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
     
            genre = new Genre({ name: 'genre' });
            await genre.save();

            movie = new Movie({ 
                
                title: 'movie1',
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: 10,
                dailyRentalRate: 10
            
            });
            await movie.save();
          
            id = movie._id; 
            token = new User({ isAdmin: true }).token;     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).token; 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no movie with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the movie if input is valid', async () => {
          await exec();
    
          const movieInDb = await Movie.findById(id);
    
          expect(movieInDb).toBeNull();
        });
    
        it('should return the removed movie', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', movie._id.toHexString());
          expect(res.body).toHaveProperty('title', movie.title);
          expect(res.body).toHaveProperty('numberInStock', movie.numberInStock);
          expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
        });
    });  
});