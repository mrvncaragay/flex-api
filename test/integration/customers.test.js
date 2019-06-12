require('express-async-errors');
require('dotenv').config();
const request = require('supertest');
const Customer = require('../../model/customer')
const User = require('../../model/user')
const mongoose = require('mongoose');
let server = require('../../app');

describe('/api/movies', () => {

    afterEach( async () => { 

        await Customer.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {

        it('should return all customers', async () => {
          
            await Customer.insertMany([
                {
                    name: 'test1',
                    isGold: false,
                    phone: '123-456-7890'
                },

                {
                    name: 'test2',
                    isGold: false,
                    phone: '123-456-7890'
                }
            ]);

            const res = await request(server).get('/api/customers');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.name === 'test1')).toBeTruthy();
            expect(res.body.some(c => c.name === 'test2')).toBeTruthy();
        });

        it('should return no customers', async () => {

            const res = await request(server).get('/api/customers');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
            expect(res.text).toBe('No customers.');
        });
    });

    describe('GET /:id', () => {
        
        it('should return a single customer if valid id is passed', async () => {

            const customer = new Customer({
                name: 'test1',
                isGold: 'false',
                phone: '123-456-7890'
            });
            await customer.save();

            const res = await request(server).get('/api/customers/' + customer._id );

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', customer.name);
        });

        it('should return 404 if invalid id is passed', async () => {

            const res = await request(server).get('/api/customers/12345');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no customer with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();

            const res = await request(server).get('/api/customers/' + id);

            expect(res.status).toBe(404);
        });
    });
        
    describe('POST /', () => {

        let token;
        let name;
        let isGold;
        let phone;
        
        const exec = async () => {

            return await request(server)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send({ 

                    name,
                    isGold,
                    phone
                 });
        };

        beforeEach(() => {

            token = new User().token;
            name = 'test1';
            isGold = false;
            phone = '131-312-5123'
        });

        it('should return 401 if client is not logged in', async () => {

            token = '';

            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if customer is less than 5 characters', async () => {

            name = 'four';
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if customer is more than 50 characters', async () => {

            name = new Array(52).join('a');
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if isGold string', async () => {

            isGold = 'dsads';
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if isGold integer', async () => {

            isGold = 1;
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if phone integer', async () => {

            phone = 1124213321;
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if phone boolean', async () => {

            phone = false;
            
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the customer if it is valid.', async () => {

            await exec();

            const customer = await Customer.find({ name: name });    
            expect(customer).not.toBeNull();
        });

        it('should return the customer if it is valid.', async () => {

            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'test1');
            expect(res.body).toHaveProperty('isGold', false);
            expect(res.body).toHaveProperty('phone', '131-312-5123');
        });
    });

    describe('PUT /:id', () => {
        
        let token;
        let newName;
        let isGold;
        let phone;
        let id;
        
        const exec = async () => {

            return await request(server)
                .put('/api/customers/' + id)
                .set('x-auth-token', token)
                .send({ 
                    name: newName, 
                    isGold: isGold,
                    phone: phone
                });
        };

        beforeEach( async () => {

            customer = new Customer({ 

                name: 'customer1',
                isGold: false,
                phone: '1234567890' 
            });
            await customer.save();
    
            token = new User().token;
            id = customer._id;
            newName = 'newCustomer1';
            isGold = true;
            phone = '987654321';
        });

        it('should return 404 if given id is invalid', async () => {

            id = 13;
            const res = await exec();

            expect(res.status).toBe(404)
        });

        it('should return 404 if given id was not found', async () => {

            id = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404)
        });

        it('should return 400 if given name is less than 5 characters', async () => {
            
            newName = 'four';
            const res = await exec();

            expect(res.status).toBe(400)
        });

        it('should return 400 if given name is more than 50 characters', async () => {
            
            newName = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400)
        });

        it('should update customer if input is valid', async () => {
            
            await exec();

            const updatedCustomer = await Customer.findById(id);

            expect(updatedCustomer.name).toBe(newName);
        });

        it('should return the updated customer if input is valid', async () => {
            
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
            expect(res.body).toHaveProperty('phone', phone);
        });
    });

    describe('DELETE /:id', () => {

        let token;
        let id;
        let customer; 
    
        const exec = async () => {

          return await request(server)
            .delete('/api/customers/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
     
            customer = new Customer({ 

                name: 'customer1',
                isGold: false,
                phone: '1234567890' 
            });
            await customer.save();
          
            id = customer._id; 
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
    
        it('should return 404 if no genre with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the customer if input is valid', async () => {
          await exec();
    
          const customerInDb = await Customer.findById(id);
    
          expect(customerInDb).toBeNull();
        });
    
        it('should return the removed customer', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', customer._id.toHexString());
          expect(res.body).toHaveProperty('name', customer.name);
        });
    });
});