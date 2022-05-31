const passport = require('passport');
const responses = require('./responses');

function jwtAuth(req, res, next)
{
    passport.authenticate('jwt', { session: false }, (err, user, info) =>
    {
        if(err)
        {
            return next(err);
        }
        if(!user)
        {
            return res.sendResponse(responses.responses.unauthorized);
        }
        req.user = user;
        return next();
    })(req, res, next);
}

function myMiddleware(req, res, next)
{
    responses.setSendResponseFunction(res);
    next();
}

module.exports.jwtAuth = jwtAuth;
module.exports.myMiddleware = myMiddleware;
