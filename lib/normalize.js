'use strict';

var helpers = require('./helpers');

exports.createModel = function(model, data) {
	var m = model.toLowerCase();

	data._id = data._id || data.id;
	if (m === 'account') {
		data._username = data._username || helpers.createUsernameHash(data.appId, data.username);
	}
	if (m === 'app') {
		data._id = helpers.createAppId();
	}
	return data;
};
