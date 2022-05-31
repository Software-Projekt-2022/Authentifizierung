const server = require('../server');
const database = require('../database');
const fs = require('fs');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const PUBLIC_KEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf-8');

const passportJwtOptions =
{
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: PUBLIC_KEY,
    algorithms: ['RS256']
};

const strategy = new JwtStrategy(passportJwtOptions, async (payload, done) =>
{
    const account = await database.getAccountAuthData(payload.sub);
    if(account)
    {
        return done(null, account);
    }
    return done(null, false, {message: 'What is this'});
});

function configPassport(passport)
{
    passport.use(strategy);
}

module.exports.configPassport = configPassport;
