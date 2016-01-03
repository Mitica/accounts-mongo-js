'use strict';

var db = require('./db');
var mongoose = require('mongoose');
var AccessService = require('./access_service');
var ControlService = require('./control_service');

function connect(connectionString, options, cb) {
	return mongoose.createConnection(connectionString, options, cb);
}

function storage(connectionString, options, cb) {
	var dbObject = db(connect(connectionString, options, cb));
	return {
		access: new AccessService(dbObject),
		control: new ControlService(dbObject)
	};
}

// exports: ============

exports.AccessService = AccessService;
exports.ControlService = ControlService;
exports.connect = connect;
exports.db = db;
exports.storage = storage;
exports.api = require('./api');
exports.apps = require('./apps');
