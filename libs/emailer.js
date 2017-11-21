'use strict';

const nodemailer = require("nodemailer")
	, sesTransport = require('nodemailer-ses-transport')
	, moment = require('moment')
	, transOptions = require('../email_config.json')
	, util = require('util');
	;

function mail(from, msg, to, subject, res){
	var transporter = nodemailer.createTransport(sesTransport(transOptions));
	
    var mailData = {
        from: from,
        to: to,
        subject: subject,
		html: msg
	};
	
    transporter.sendMail(mailData, function(err, info){
        info = JSON.stringify(info);
		info = JSON.parse(info);
		
		if(err || info === null){
			console.log(util.inspect(err, false, null, { colors: true }))
			res.json({
				from: mailData.from,
				to: mailData.to,
				time: `${err.time}`,
				status: 'failed',
				code: `${err.code}`,
				statusCode: `${err.statusCode}`,
				requestId: `${err.requestId}`,
				error: `${err.message}`
			});
			return;
        } 

		console.log(`Email Sent ID: ${info.messageId}\n`);

		/**
		 * We reply that the message was sent successfully or reply with error
		 *
		 * We do a check for our optional key if its not there we
		 * dont send anything back that key value pair.
		 */

		res.json({
			time_completed: `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
			status: 'sent',
			id: `${info.messageId}`
		});

		

    });
}

module.exports = mail;