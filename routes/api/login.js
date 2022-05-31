const express = require('express');
const router = express.Router();

const { responses } = require('../../responses');
const database = require('../../database');
const jwt_util = require('../../jwt_util');
const bcryptjs = require('bcryptjs');
const validation = require('../../validation');
const { validationResult } = require('express-validator');

router.post('/', validation.schema.login,
async function(req, res, next)
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.sendResponse(responses.validation_fail, '', null, errors);
    }

    const account = await database.getAccountAuthData(req.body.email);

    if(account && await bcryptjs.compare(req.body.password, account.password))
    {
        const jwt = jwt_util.makeJWT(req.body.email);
        res.sendResponse(responses.success, '',
        {
            account_id: account.account_id,
            jwt: jwt
        });
        return;
    }
    else
    {
        res.sendResponse(responses.acc_not_found, `Account '${req.body.email}' was not found or password is wrong.`, null);
    }

},
function(err, req, res, next)
{
    return res.sendResponse(responses.acc_not_found, `Account '${req.body.email}' was not found or password is wrong.`, null);
});

module.exports = router;
