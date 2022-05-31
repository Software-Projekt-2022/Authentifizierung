const express = require('express');
const router = express.Router();

const { responses } = require('../../responses');
const { jwtAuth } = require('../../middleware');

router.delete('/', jwtAuth, async (req, res) =>
{
    if (req.session)
    {
        req.session.destroy(err =>
        {
            if (err)
            {
                res.sendResponse(responses.logout_fail, 'Failed to log out for some reason', null);
            }
            else
            {
                res.sendResponse(responses.success);
            }
        });
    }
    else
    {
        res.end();
    }
});

module.exports = router;
