'use strict';

// var utils = require('./utils');
var providerLogin = require('./provider_login');
var helpers = require('./helpers');

module.exports = function(appId, storage) {
	var Data = {
		appId: appId,
		access: storage.access,
		control: storage.control
	};

	var api = {
		providerLogin: providerLogin(Data),
		accountById: function(id) {
			return storage.access.account({
				where: {
					_id: id
				}
			});
		},
		accountByUsername: function(username) {
			return storage.access.account({
				where: {
					_username: helpers.createUsernameHash(appId, username)
				}
			});
		},
		accounts: storage.access.accounts,
		updateAccount: storage.control.updateAccount
	};

	return api;
};
