'use strict';

if (!process.env.ACCOUNTS_CONNECTION_STRING) {
	console.log('NO ENV CONNECTION_STRING');
	module.exports = false;
	return;
}

module.exports = require('../../lib/storage')();
