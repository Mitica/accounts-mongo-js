'use strict';

var mongoose = require('mongoose');
var db = require('./db');
var Service = require('./service');
var utils = require('./utils');

var USER = 'User';

module.exports = function(connectionString, connectionOptions) {
	var connection = mongoose.createConnection(connectionString, connectionOptions);

	var service = new Service(db(connection));

	var storage = {
		users: {
			create: function(appId, data) {
				data.appId = appId;

				return service.create(USER, data);
			},
			update: function(appId, data) {
				delete data.appId;
				delete data.usernameKey;

				if (data.username) {
					data.usernameKey = utils.createUsernameKey(appId, data.username);
				}

				return service.update(USER, data);
			},
			getById: function(appId, id) {
				return service.one(USER, { where: { _id: id } });
			}
		}
	};

	return storage;
};
