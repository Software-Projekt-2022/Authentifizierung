const request = require('supertest')(process.env.TEST_SERVER_HOST);
const expect = require('chai').expect;
const database = require('../database');

describe(`Test account system`, function ()
{
    it('should register the user, login and logout successfully', async function ()
    {
        // Register a user
        await database.doQuery('CALL PrepareTestEnv();');
        let response = await request.post('/api/accounts').send(
        {
            email: 'new.test.user@test.org',
            first_name: "TestName",
            last_name: "TestLastName",
            date_of_birth: "2022-05-25",
            street: "Main Street",
            house_number: "123b",
            password: 'TestPW'
        });
        expect(response.status).to.eql(201);

        // Login with created user
        response = await request.post('/api/login').send(
        {
            email: 'new.test.user@test.org',
            password: 'TestPW'
        });
        expect(response.status).to.eql(200);

        // Check if user exists
        const jwt = response.body.content.jwt.token;
        response = await request.get('/api/accounts/findByEmail?email=new.test.user@test.org').set('Authorization', jwt);
        expect(response.status).to.eql(200);

        // Log out
        response = await request.delete('/api/logout').set('Authorization', jwt);
        expect(response.status).to.eql(200);
    });
});
