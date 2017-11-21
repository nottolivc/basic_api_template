'use strict';

const express = require('express')
	, bodyParser = require('body-parser')
	, jwt = require('jsonwebtoken')
	, helmet = require('helmet')
	, morgan = require('morgan')
	, app = express()
	, mysql = require('mysql2')
	, moment = require('moment')
	, path = require('path')
	, fs = require('fs')
	, router = express.Router()
	, authenticateController = require('./controllers/authenticate-controller')
	;

/**
 * Secret key for JWT
 */
process.env.SECRET_KEY="somekeyhere";

/**
 * Version
 */
const version = '0.0.1';

/**
 * Configurable Web Settings
 */
const express_port = 8558;

/**
 * Flags
 */
var toggleHTTPS = true;

/**
 * CLI arguments related to: Flags
 */
if(process.argv.slice(2)){
	let cliOptions = process.argv.slice(2);
	switch(cliOptions[0]){
		case 'true':
			toggleHTTPS = true;
		break;
		case 'false':
			toggleHTTPS = false;
		break;
		default:
			console.log('Invalid arguments\nTo toggle SSL ex. node index.js true');
	}
}

/**
 * Toggle HTTP or HTTPS
 */
switch(toggleHTTPS) {
	case true:
		const https = require('https');

		var options = { // load our SSL certificate
			pfx: fs.readFileSync('./certs/ssl.pfx')
			, passphrase: 'digally123'
	   	};

		https.createServer(options, app).listen(express_port);
        break;
	default:
		const http = require('http');
		http.createServer(app).listen(express_port);
}

/**
* SQL Database connection
*/
const sql_config = require('./sql_config.json'); // SQL configuration file
var connection = mysql.createPool(sql_config); // Recreate the connection

global.db = connection;

connection.on('error', (err) => {
	console.error(err.message);
});

/**
 * Helmet
 */
app.use(helmet());

/**
* Morgan
*/
app.use(morgan('combined'));

/**
* Disable reporting by x-powered-by
*/
app.disable('x-powered-by');

/**
 * BodyParser
 */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/**
 * Authentication Controller
 */
app.post('/api/authenticate', authenticateController.authenticate);
app.use('/secure', router);

/**
 * Validation middleware
 */
router.use(function(req, res, next){
	var token = req.body.token || req.headers['token'];
	if(token){
		next();
	}else{
		res.json('Please send a token')
	}
});

/**
 * Routes to load
 */
router.get('/api', require('./routes/api'));
router.get('/checkToken', userCheck, require('./routes/checkToken'));
router.get('/users', userCheck, require('./routes/users'));
router.post('/email', userCheck, require('./routes/email'));

/**
 * Check account role to see if content will load for API user
 * @param {Function} req // request
 * @param {Function} res // response
 * @param {Function} next // next
 */
function userCheck(req, res, next) {
	var token = req.body.token || req.headers['token'];
	jwt.verify(token, process.env.SECRET_KEY, function(err, jwtres){
		if(err){
			res.status(500).json('Token Invalid');
		}else{
			console.log(req.originalUrl);
			console.log(`Response: ${JSON.stringify(jwtres)}`);

			/**
			 * Validate for user role
			 */
			switch(jwtres.role) {
				case 1:
					console.log('Detected Super User Account');
					next(); // if user has correct role we let them pass
				break;
				case 2:
					console.log('Detected Default Restricted Account');
					res.status(401).json({ error: 'Unauthorized' });
				break;
				default:
					res.status(401).json({ error: 'Unauthorized' });
				break;
			}
		}
	});
};

/**
 * Express Server Listening
 */
app.listen = function() {
	var server = http.createServer(this);
	return server.listen.apply(server, arguments);
};

console.log(`FleetVu API is listening on: ${express_port} - SSL: ${toggleHTTPS}`);

module.exports = app;