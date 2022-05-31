const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf-8');

function makeJWT(sub)
{
    const expiresIn = '1h';
    const payload =
    {
        sub: sub
    };
    const jwtOptions =
    {
        expiresIn: expiresIn,
        algorithm: 'RS256'
    }
    const jwt =
    {
        token: 'JWT ' + jsonwebtoken.sign(payload, PRIVATE_KEY, jwtOptions),
        expiresIn: expiresIn
    };
    return jwt;
}

module.exports.makeJWT = makeJWT;
