'use strict';

const express = require('express')
, router = express.Router()
;

/**
* Route
*/
router.get('/users', function(req, res, next) {
	db.query('SELECT userName as username from Users', function(err, results){
		res.json(results);
	});
});

module.exports = router;