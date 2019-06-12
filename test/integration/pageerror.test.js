require('dotenv').config();
const request = require('supertest');
const server = require('../../app'); 

describe('Status 404', () => {

    afterEach( async () => { 

        await server.close();
    });

    it('it should return page not found for invalid path', async () => {

        const res = await request(server).get('/api');

        expect(res.status).toBe(404); 
    });
    
    it('it should return page not found for invalid path', async () => {

        const res = await request(server).get('/api/users/1');

        expect(res.status).toBe(404); 
    });
    
    it('it should return page not found for invalid path', async () => {

        const res = await request(server).get('/api/admins/1');

        expect(res.status).toBe(404); 
    });   
});