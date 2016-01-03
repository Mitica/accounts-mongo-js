'use strict';

// var utils = require('./utils');
var providerLogin = require('./provider_login');

module.exports = function(appId, storage) {
	var Data = {
		appId: appId,
		access: storage.access,
		control: storage.control
	};

	var api = {
		providerLogin: providerLogin(Data)
	};

	return api;
};
