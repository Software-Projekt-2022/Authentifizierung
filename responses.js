const passport = require('passport');

const responses =
{
    success: { code: 200, msg: 'SUCCESS'},
    internal_server_error: { code: 500, msg: 'ERR_INTERNAL'},
    created: { code: 201, msg: 'SUCCESS'},
    acc_not_found: { code: 404, msg: 'ERR_ACC_NOT_FOUND'},
    unauthorized: { code: 401, msg: 'ERR_UNAUTHORIZED'},
    logout_fail: { code: 400, msg: 'ERR_LOGOUT_FAIL'},
    not_implemented: { code: 418, msg: 'ERR_NOT_IMPLEMENTED'},
    validation_fail: { code: 422, msg: 'ERR_VALIDATION'},
    username_taken: { code: 409, msg: 'ERR_USERNAME_TAKEN'},
    email_taken: { code: 409, msg: 'ERR_EMAIL_TAKEN'}
};

function setSendResponseFunction(res)
{
    res.sendResponse = (response, dvMsg = '', ctnt = null, errs = []) =>
    {
        if(errs.array && typeof errs.array === 'function') //is this a Result<ValidationError> from express-validator?
        {
            const validationErrors = errs.array();
            errs = [];
            validationErrors.forEach(e =>
            {
                errs.push(e.msg);
            });
        }

        if(dvMsg == '' && response.code >= 400)
        {
            dvMsg = 'computer sagt nein';
        }

        res.status(response.code).json(
        {
            code: response.msg,
            devMsg: dvMsg,
            errors: errs,
            content: ctnt
        });
    };
}

module.exports.responses = responses;
module.exports.setSendResponseFunction = setSendResponseFunction;
