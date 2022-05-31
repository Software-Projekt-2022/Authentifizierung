//Node libs
const express = require('express');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const morgan = require('morgan');

const app = express();
app.enable('trust proxy');

const swaggerDocument = YAML.load('./api/swagger.yml');
const { myMiddleware } = require('./middleware');

//Configure passport
const configPassport = require('./config/passport-config-jwt');
configPassport.configPassport(passport);

//Logging
app.use(morgan('short'));

//Configure express
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(myMiddleware);

//Add routers
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/validate_token', require('./routes/api/validate_token'));
app.use('/api/accounts', require('./routes/api/accounts'));
app.use('/api/accounts/findByEmail', require('./routes/api/accounts/findByEmail'));
app.use('/api/accounts/findByID', require('./routes/api/accounts/findByID'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log(`Listening on ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}...`);
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST);
