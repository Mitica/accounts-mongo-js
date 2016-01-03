'use strict';

var utils = require('./utils');

var createUsername = exports.createUsername = function createUsername(username) {
	username = username || utils.randomString(8);
	username = username.trim().toLowerCase().replace(/[\s-]+/g, '-').replace(/-{2,}/, '-');
	return utils.atonic.lowerCase(username);
};

exports.isValidUsername = function(username) {
	return utils._.isString(username) && username.trim().length > 2 && username.length < 32;
};

exports.createUsernameHash = function createUsernameHash(appId, username) {
	return utils.md5([appId.trim(), createUsername(username)].join('|'));
};

exports.createAccountId = function createAccountId() {
	return utils.uuid().toLowerCase();
};

exports.createAppId = function createAppId() {
	return utils.randomString(16);
};

exports.createAccountConnectionId = function createAccountConnectionId(appId, provider, providerId) {
	return utils.md5([appId.trim(), provider.trim().toLowerCase(), providerId.trim()].join('|'));
};
