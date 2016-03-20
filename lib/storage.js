'use strict';

var mongoose = require('mongoose');
var db = require('./db');
var Service = require('./service');
var utils = require('./utils');
var Promise = utils.Promise;
var envs = require('./envs');

var USER = 'User';
var APP = 'App';
var CONNECTION = 'Connection';

module.exports = function(connectionString, connectionOptions) {
	connectionString = connectionString || envs.connectionString;

	if (typeof connectionString !== 'string') {
		throw new Error('`connectionString` must be a string');
	}
	var connection = mongoose.createConnection(connectionString, connectionOptions);
	var service = new Service(db(connection));

	var storage = {
		admin: {
			sync: function() {
				return Promise.resolve();
			},
			drop: function() {
				return Promise.resolve();
			}
		},
		apps: {
			create: function(data) {
				return service.create(APP, data);
			},
			update: function(data) {
				return service.update(APP, data);
			},
			getById: function(id) {
				return service.one(APP, { where: { _id: id } });
			}
		},
		users: {
			create: function(appId, data) {
				data.appId = appId;

				data._username = utils.createUsernameKey(appId, data.username);

				return service.create(USER, data);
			},
			update: function(appId, data) {
				delete data.appId;
				delete data._username;

				if (data.username) {
					data._username = utils.createUsernameKey(appId, data.username);
				}

				return service.update(USER, data);
			},
			getById: function(appId, id) {
				return service.one(USER, { where: { _id: id } });
			},
			getByUsername: function(appId, username) {
				var hash = utils.createUsernameKey(appId, username);
				return service.one(USER, { where: { _username: hash } });
			}
		},
		connections: {
			create: function(appId, data) {
				data.appId = appId;

				return service.create(CONNECTION, data);
			},
			update: function(appId, data) {
				delete data.appId;

				return service.update(CONNECTION, data);
			},
			getById: function(appId, id) {
				return service.one(CONNECTION, { where: { _id: id } });
			}
		},
		db: {
			connection: connection
		}
	};

	return storage;
};
