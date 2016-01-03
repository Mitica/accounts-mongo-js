'use strict';

var helpers = require('./helpers');
var utils = require('./utils');
var Promise = utils.Promise;

module.exports = function newUsername(appId, access, profile) {
	profile = profile || {};
	var usernames = [profile.username, profile.displayName, profile.givenName, profile.familyName, profile.givenName + ' ' + profile.familyName];
	usernames = usernames.filter(function(item) {
		return helpers.isValidUsername(item);
	});
	usernames.push(false);
	usernames.push(false);

	usernames = usernames.filter(function(item) {
		return helpers.isValidUsername(helpers.createUsername(item));
	});

	var username;

	console.log('usernames', usernames);

	return Promise.each(usernames, function(item) {
		if (!username) {
			var hash = helpers.createUsername(item);
			hash = helpers.createUsernameHash(appId, hash);
			return access.account({
				where: {
					_username: hash
				}
			}).then(function(account) {
				if (!account) {
					username = item;
				}
			});
		}
	}).then(function() {
		return username;
	});
};
