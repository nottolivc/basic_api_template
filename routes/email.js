'use strict';

const express = require('express')
	, router = express.Router()
	, mail = require('../libs/emailer.js')
	;

/**
 * Secret Key
 */
var sec_key =  'mysecretkey';

/**
 * Route
 */
router.post('/email', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');

	var obj = req.body;
		obj.BODY = obj.BODY.toString();
	console.log(obj);

	try {
		var from				= obj.FROM;
		var emailAddresses 		= obj.TO;
		var emailSubject 		= obj.SUBJECT;
		var emailBody 			= new Buffer(obj.BODY, 'hex');
		var sec_id				= obj.IDENTIFY;

		if (sec_id === sec_key){
			mail(from, emailBody, emailAddresses, emailSubject, res);
		} else {
			console.log('Invalid Key or none given');
			res.status(500).json('Token Invalid');
		}

	}
	catch(e){
		console.error(e);
	}

	/**
	 * Debug output
	 */
	// var x = req.body;
	
	// x = x.replace(/ *\b\S*query([=])/g, '');
	// console.log('Debug:', req.body);
});

module.exports = router;