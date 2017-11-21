'use strict';

const version = '0.0.1'
	, os = require('os')
	, express = require('express')
	, router = express.Router()
;

/**
* Route
*/
router.get('/api', function(req, res, next) {
	res.json({
		api: 'My API Template Restful',
		version: `${version}`,
		platform: os.platform(),
		os: os.release(),
		arch: os.arch(),
		cpu: os.cpus(),
		totalmem: os.totalmem(),
		mem: os.freemem(),
		hostname: os.hostname(),
		loadavg: os.loadavg(),
		nic: os.networkInterfaces(),
		uptime: os.uptime()
	})
});

module.exports = router;