'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('util');
var NAMES = ['App', 'User', 'Connection'];
var envs = require('../envs');
var PREFIX = envs.collectionPrefix || '';

function BaseSchema() {
	Schema.apply(this, arguments);

	if (!this.paths.createdAt) {
		this.add({
			createdAt: {
				type: Number,
				default: Date.now
			}
		});
	}
	if (!this.paths.updatedAt) {
		this.add({
			updatedAt: {
				type: Number
			}
		});
	}
}

util.inherits(BaseSchema, Schema);

var App = new BaseSchema({
	_id: {
		type: String
	},
	name: {
		type: String,
		required: true
	}
}, {
	collection: [PREFIX, 'apps'].join(''),
	strict: false
});

var User = new BaseSchema({
	// unique id
	_id: {
		type: String
	},
	appId: {
		type: String,
		index: true
	},
	// unique MD5(appId:usernameLower)
	_username: {
		type: String,
		required: true,
		minlength: 32,
		maxlength: 32,
		unique: true
	},
	username: {
		type: String,
		required: true
	},
	displayName: {
		type: String
	},
	familyName: {
		type: String
	},
	givenName: {
		type: String
	},
	middleName: {
		type: String
	},
	email: {
		type: String
	},
	gender: {
		type: String
	},
	status: {
		type: String,
		required: true
	},
	// user, admin, etc.
	role: {
		type: String,
		required: true
	},
	createdAt: {
		type: Number,
		required: true,
		index: true
	}
}, {
	collection: [PREFIX, 'users'].join(''),
	strict: false
});

var Connection = new BaseSchema({
	// MD5(appId:provider:providerId)
	_id: {
		type: String
	},
	userId: {
		type: String,
		required: true,
		index: true
	},
	appId: {
		type: String,
		required: true
	},
	provider: {
		type: String,
		required: true
	},
	profileId: {
		type: String,
		required: true
	},
	accessData: {
		type: String,
		required: true
	},
	displayName: {
		type: String
	},
	familyName: {
		type: String
	},
	givenName: {
		type: String
	},
	middleName: {
		type: String
	},
	email: {
		type: String
	},
	gender: {
		type: String
	}
}, {
	collection: [PREFIX, 'connections'].join(''),
	strict: false
});

// settings: ==============

User.set('toObject', {
	getters: true
});
Connection.set('toObject', {
	getters: true
});
App.set('toObject', {
	getters: true
});


// exports: ===============
exports.User = User;
exports.Connection = Connection;
exports.App = App;
exports.NAMES = NAMES;
