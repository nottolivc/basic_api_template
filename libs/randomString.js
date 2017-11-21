'use strict';

var randomString = function(length, chars){
	var mask = '';
	if(chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	if(chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if(chars.indexOf('#') > -1) mask += '0123456789';
	if(chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	var result = '';
	for (var i = 0; i < length; i++) {
		result += mask.charAt(Math.floor(Math.random() * mask.length));
	}
	return result;
}

module.exports = randomString;