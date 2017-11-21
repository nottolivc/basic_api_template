'use strict';

const jwt = require('jsonwebtoken')
	, passCheck = require('../libs/hashSalt')
;

module.exports.authenticate=function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	console.log(req.originalUrl);
	// console.log(`username: ${username}`);
	// console.log(`password: ${password}`);
	db.query('SELECT * FROM APIUsers WHERE UserName = ?',[username], function (error, results, fields) {
		if(Object.keys(results).length !== 0){
			if(results[0].Password && results[0].SaltKey){
				passCheck(req.body.password).verifyAgainst(results[0].Password, results[0].SaltKey, function(checkErr, checkResults){
					if(!checkErr && checkResults){

						var payload = {
							user: results[0].UserName,
							role: results[0].UserRoleID
						};
		
						const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '3600s'}); // make tokens live for 60 minutes

						res.json({
							status: true,
							token: token
						})
					} else if (checkErr) {
						console.error(checkErr);
						res.json({
							status: false,                  
							message: "Username and password does not match"
						});
					} else {
						res.json({
							status: false,                  
							message: "Username and password does not match"
						});
					}
				});
		
				if (error) {
					res.json({
						status: false,
						message: 'there are some error with query'
					})
				}
			} else {
				res.json({
					status: false,
					message: 'there are some error with query'
				})
			}
		} else {
			res.json({
				status: false,
				message: 'no results'
			})
		}
	});
}