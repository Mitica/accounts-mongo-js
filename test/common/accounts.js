'use strict';

if (!process.env.ACCOUNTS_CONNECTION) {
	console.log('NO ENV ACCOUNTS_CONNECTION');
	module.exports = false;
	return;
}

var accounts = require('../../lib');
var storage = accounts.storage(process.env.ACCOUNTS_CONNECTION);

exports.storage = storage;
exports.apps = accounts.apps(storage);
exports.api = accounts.api;
