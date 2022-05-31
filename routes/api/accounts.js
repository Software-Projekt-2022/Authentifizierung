const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');

const { responses } = require('../../responses');
const { jwtAuth } = require('../../middleware');

const validation = require('../../validation');
const { validationResult } = require('express-validator');

const database = require('../../database');

router.post('/', validation.schema.create_account, async (req, res) =>
{
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

    if(success)
    {
        console.log('Registration successful.');
        res.sendResponse(responses.created);
    }
    else
    {
        console.log('Registration failed.');
        res.sendResponse(responses.internal_server_error, 'Failed to insert into database for some reason');
    }
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

module.exports = router;
