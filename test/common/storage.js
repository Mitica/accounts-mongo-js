'use strict';

if (!process.env.CONNECTION_STRING) {
	console.log('NO ENV CONNECTION_STRING');
	module.exports = false;
	return;
}

var storage = require('../../lib')(process.env.CONNECTION_STRING);

exports.storage = storage;
