'use strict';

const randomString = require('./randomString')
	, crypto = require('crypto')
	;

// password('SomethingMadeUp').hash(function(err, result){
// 		if(err)
// 			return(err);
// 		var salt = result.salt;
// 		var hash = result.hash;
// 		// do something with salt and hash
// });
// 
// password('SomethingMadeUp').verifyAgainst('HASH HEX FROM DB', 'SALT HEX FROM DB', function(err, result){
// 		if(err)
// 			return(err);
// 		//check if password matched provided hash	
// 		if(result){
// 			//result is true password matches create session and allow login;
// 		} else {
// 			//results if false, redirect to login page with error message.
// 		}
// });

/**
 * Given a password as a variable can get salt and hash of password or verify password is correct
 * by checking the proviced hash and salt.
 * @param  {string} password 		password provided from login credentials
 * @return {callback Object}        for hash, callback is an object of {salt: "HEX STRING", hash: "HEX STRING"}
 *                                  for verifyAgainst, callback is a boolean of true/false or error
 */
var password = function(password){
	return {
		/**
		 * given a password will take either a provided salt or generate a random salt and return a
		 * hashed password and the salt used.
		 * @param  {String/Buffer}   salt     salt to be used to calculate a hash of the given password
		 * @param  {Function} callback What to do when done.
		 * @return {callback Object}            an object of {salt: "HEX STRING", hash: "HEX STRING"}
		 */
		hash: function(salt, callback){
			//make salt optional
			if(callback === undefined && salt instanceof Function){
				callback = salt;
				salt = undefined;
			}

			if(!password){
				return callback('No Password Provided');
			}

			if(typeof salt === 'string'){
				salt = Buffer.from(salt);
			}

			var calcHash = function(){
				var buff_PassSalt = Buffer.concat([ Buffer.from(password), salt], Buffer.from(password).length + salt.length);
				var passHash = crypto.createHash('sha1').update(buff_PassSalt).digest('hex').toUpperCase();
				callback(null, {salt: salt.toString('utf8'), hash: passHash})
			};

			if(!salt){
				salt = Buffer.from(this.genSalt());
				calcHash();
			} else {
				calcHash();
			}
		},
		/**
		 * Takes password, salt, and hashed password and compairs them to each other to determine if match occures
		 * @param  {string}   hashedPassword Hash stored in DB to match against password and salt
		 * @param  {string}   salt           Salt stored in DB to add to password to match against hashedPassword
		 * @param  {Function} callback       what to do when done
		 * @return {boolean callback}                  true/false or Error
		 */
		verifyAgainst: function(hashedPassword, salt, callback){
			//check to see if provided password, hashedPassword(from DB), and salt(from DB) provided.
			if(!hashedPassword || !salt || !password)
				return callback(null, false);

			//Check to see if Hashed password in DB matches salt and password hashed together.
			this.hash(salt, function(error, newHash){
				if(error) return callback(error);
				callback(null, newHash.hash === hashedPassword);
			});
		},

		genSalt: function(){
			// uses random AlphaNumeric String with its length matching
			// the length of the supplied email address.
			// <cfset form.salt = daCFC.randStr(len(form.email),"alphanumericupper")>
			// I chose to just do a random length alphaNumeric string between 16 and 64 chars in length
			// so email or email length does not need to be passed as a variable to the password function
			return randomString(Math.floor(Math.random() * (Math.floor(64) - Math.ceil(16) + 1)) + Math.ceil(16), 'aA#');
		}
	};
}

module.exports = password;