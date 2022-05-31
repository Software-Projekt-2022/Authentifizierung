const express = require('express');
const router = express.Router();

const { responses } = require('../../../responses');

const database = require('../../../database');
const validation = require('../../../validation');
const { validationResult } = require('express-validator');


router.get('/', validation.schema.findByEmail, async (req, res) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.sendResponse(responses.validation_fail, '', null, errors);
    }
    
    acc = await database.getAccountByEmail(req.query.email);

    if(acc == null)
    {
        res.sendResponse(responses.acc_not_found);
    }
    else
    {
        res.sendResponse(responses.success, '', acc);
    }
});

module.exports = router;