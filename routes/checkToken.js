'use strict';

const express = require('express')
	, router = express.Router()
;

/**
* Route
*/
router.get('/checkToken', function(req, res, next) {
	res.json(`Token Verified`);
});

module.exports = router;