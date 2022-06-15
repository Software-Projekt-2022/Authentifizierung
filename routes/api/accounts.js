const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');

const { responses } = require('../../responses');
const { jwtAuth } = require('../../middleware');

const validation = require('../../validation');
const { validationResult } = require('express-validator');

const database = require('../../database');

const event_system_connection = require('../../events/event_system_connection');
const event_factory = require('../../events/event_factory');

const err_reg_no_event =
`Account wurde der Datenbank hinzugefügt, aber kein Event wurde gesendet.
Microservices sollten mit GET /api/accounts ihre Datenbank abgleichen.`;

router.post('/', validation.schema.create_account, async (req, res) =>
{
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.sendResponse(responses.validation_fail, '', null, errors);
    }
    console.log('Client tried to register account with validated body:');
    console.log(req.body);

    if(await database.isEmailTaken(req.body.email))
    {
        console.log('Registration failed: email taken.');
        res.sendResponse(responses.email_taken);
        return;
    }

    // Hash
    let pass = await bcryptjs.hash(req.body.password, 10);
    let success = await database.registerAccount(
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.date_of_birth,
        req.body.street,
        req.body.street2,
        req.body.house_number,
        pass);
    
    console.log('Inserted account into database.');

    if(!success)
    {
        console.log('Registration failed.');
        res.sendResponse(responses.internal_server_error, 'Failed to insert into database for some reason');
        return;
    }

    // Send event
    // TODO: account ID should be returned by insert
    let acc = await database.getAccountByEmail(req.body.email);
    if(!acc)
    {
        console.log('Registration successful. Failed to retrieve account info from database right after it was inserted. Data remains in database but no event was sent.');
        res.sendResponse(responses.internal_server_error, err_reg_no_event);
        return;
    }

    try
    {
        await event_system_connection.sendEvent(event_factory.accountCreatedEvent(acc));
    }
    catch(err)
    {
        console.log('Registration successful but failed to send event: ' + err.message);
        res.sendResponse(responses.internal_server_error, err_reg_no_event);
        return;
    }

    console.log('Registration successful.');
    res.sendResponse(responses.created);
})

router.patch('/', jwtAuth, validation.schema.update_account, async (req, res) =>
{
    if(req.user.email !== req.query.email)
    {
        res.sendResponse(responses.unauthorized);
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.sendResponse(responses.validation_fail, '', null, errors);
    }

    if(req.body.email && await database.isEmailTaken(req.body.email))
    {
        res.sendResponse(responses.email_taken);
        return;
    }

    if(req.body.password)
    {
        let pass = await bcryptjs.hash(req.body.password, 10);
        req.body.password = pass;
    }

    await database.updateAccount(req.query.email, req.body);
    res.sendResponse(responses.success);
});

router.delete('/', jwtAuth, async (req, res) =>
{
    res.sendResponse(responses.not_implemented);
});

router.get('/', async (req, res) =>
{
    const accs = await database.getAccountIDs();
    if(accs)
    {
        res.sendResponse(responses.success, '', accs);
        return;
    }
    res.sendResponse(responses.internal_server_error);
});

module.exports = router;
