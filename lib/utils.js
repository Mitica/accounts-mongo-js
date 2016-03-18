'use strict';

exports._ = require('lodash');
var crypto = require('crypto');
exports.Promise = require('bluebird');
var md5 = exports.md5 = function(value) {
	return crypto.createHash('md5').update(value).digest('hex').toLowerCase();
};

exports.createUsernameKey = function createUsernameKey(appId, username) {
	return md5([appId.trim(), username.trim()].join('|'));
};
