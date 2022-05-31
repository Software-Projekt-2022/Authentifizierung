const express = require('express');
const router = express.Router();

const { responses } = require('../../responses');
const { jwtAuth } = require('../../middleware');

module.exports = router.get('/', jwtAuth,
async function(req, res, next)
{
    if(req.query.email && req.user.email !== req.query.email)
    {
        res.sendResponse(responses.unauthorized, '', null);
        return;
    }

    res.sendResponse(responses.success);
});
