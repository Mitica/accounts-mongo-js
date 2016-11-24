'use strict';

const mongoose = require('mongoose');
const db = require('./db');
const Service = require('./service_wrapper');
const utils = require('./utils');
const Promise = utils.Promise;
const envs = require('./envs');

module.exports = function(connection) {

	connection = connection || envs.connectionString;

	if (!connection) {
		throw new Error('`connection` is required');
	}

	if (typeof connection === 'string') {
		connection = mongoose.createConnection(connection);
	}

	const service = new Service(db(connection));

	const storage = {
		// DB admin
		admin: {
			sync: function() {
				return Promise.resolve();
			},
			drop: function() {
				return Promise.resolve();
			}
		},
		// apps API
		apps: {
			create: function(data) {
				return Promise.resolve(data);
			},
			getById: function(id) {
				return Promise.resolve({ id: id });
			}
		},
		// users API
		users: {
			create: function(appId, data) {
				return service.create(appId, 'User', data);
			},
			update: function(appId, data) {
				return service.update(appId, 'User', data);
			},
			getById: function(appId, id) {
				return service.getById(appId, 'User', id);
			}
		},
		// identities API
		identities: {
			create: function(appId, data) {
				return service.create(appId, 'Identity', data);
			},
			update: function(appId, data) {
				return service.update(appId, 'Identity', data);
			},
			getById: function(appId, id) {
				return service.getById(appId, 'Identity', id);
			}
		}
	};

	return storage;
};
