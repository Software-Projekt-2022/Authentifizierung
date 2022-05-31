const request = require('supertest')(process.env.TEST_SERVER_HOST);
const expect = require('chai').expect;
const database = require('../database');

describe(`Test account update`, function ()
{
    it('should update the account and then get the updated data back', async function ()
    {
        await database.doQuery('CALL PrepareTestEnv();');

        // Log in as test.user2@test.org
        response = await request.post('/api/login').send(
        {
            email: 'test.user2@test.org',
            password: 'TestPW2'
        });
        expect(response.status).to.eql(200);

        // Change email to test.user.changed@test.org
        let jwt = response.body.content.jwt.token;
        response = await request.patch('/api/accounts?email=test.user2@test.org').set('Authorization', jwt).send({email: 'test.user.changed@test.org'});
        expect(response.status).to.eql(200);

        // Need to log in again because email changed
        response = await request.post('/api/login').send(
        {
            email: 'test.user.changed@test.org',
            password: 'TestPW2'
        });
        expect(response.status).to.eql(200);

        // Change email back to test.user2@test.org
        jwt = response.body.content.jwt.token;
        response = await request.patch('/api/accounts?email=test.user.changed@test.org').set('Authorization', jwt).send({email: 'test.user2@test.org'});
        expect(response.status).to.eql(200);

        // Need to log in again because email changed
        response = await request.post('/api/login').send(
        {
            email: 'test.user2@test.org',
            password: 'TestPW2'
        });
        expect(response.status).to.eql(200);

        // Try to change email to null
        jwt = response.body.content.jwt.token;
        response = await request.patch('/api/accounts?email=test.user2@test.org').set('Authorization', jwt).send({email: null});
        expect(response.status).to.eql(422);

        // Change first name to jeff
        response = await request.patch('/api/accounts?email=test.user2@test.org').set('Authorization', jwt).send({first_name: 'jeff'});
        expect(response.status).to.eql(200);

        // Check if first name is now jeff
        response = await request.get('/api/accounts/findByEmail?email=test.user2@test.org').set('Authorization', jwt);
        expect(response.status).to.eql(200);
        expect(response.body.content.first_name).to.eql('jeff');
    });
});
