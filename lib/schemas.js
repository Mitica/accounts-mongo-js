'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('util');
var NAMES = ['App', 'Account', 'AccountConnection'];
var PREFIX = process.env.ACCOUNTS_COLLECTION_PREFIX || '';

function BaseSchema() {
	Schema.apply(this, arguments);

	if (!this.paths.createdAt) {
		this.add({
			createdAt: {
				type: Date,
				default: Date.now
			}
		});
	}
	if (!this.paths.updatedAt) {
		this.add({
			updatedAt: {
				type: Date
			}
		});
	}

	this.pre('save', function(next) {
		this.updatedAt = Date.now();
		next();
	});
}

util.inherits(BaseSchema, Schema);

var App = new BaseSchema({
	_id: {
		type: String,
		minlength: 8,
		maxlength: 36,
		trim: true
	},
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 36,
		trim: true,
		unique: true
	}
}, {
	collection: [PREFIX, 'Apps'].join('')
});

var Account = new BaseSchema({
	// unique id
	_id: {
		type: String,
		minlength: 36,
		maxlength: 36,
		lowercase: true,
		trim: true
	},
	appId: {
		type: String,
		minlength: 8,
		maxlength: 36,
		lowercase: true,
		trim: true,
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
		required: true,
		maxlength: 32,
		minlength: 2
	},
	displayName: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 64
	},
	familyName: {
		type: String,
		minlength: 1,
		maxlength: 24
	},
	givenName: {
		type: String,
		minlength: 1,
		maxlength: 24
	},
	middleName: {
		type: String,
		minlength: 1,
		maxlength: 24
	},
	email: {
		type: String,
		minlength: 5,
		maxlength: 64,
		trim: true,
		lowercase: true
	},
	gender: {
		type: String,
		enum: {
			values: 'male female'.split(' '),
			message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
		}
	},
	status: {
		type: String,
		enum: {
			values: 'active locked'.split(' '),
			message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
		},
		default: 'active'
	},
	// user, admin, etc.
	role: {
		type: String,
		lowercase: true,
		minlength: 2,
		maxlength: 16,
		default: 'user'
	},
	createdAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	lastLoginAt: {
		type: Date,
		default: Date.now
	}
}, {
	collection: [PREFIX, 'Accounts'].join('')
});

var AccountConnection = new BaseSchema({
	// MD5(appId:provider:providerId)
	_id: {
		type: String,
		minlength: 32,
		maxlength: 32,
		lowercase: true,
		trim: true
	},
	accountId: {
		type: String,
		required: true,
		minlength: 36,
		maxlength: 36,
		lowercase: true,
		trim: true,
		index: true
	},
	appId: {
		type: String,
		minlength: 8,
		maxlength: 36,
		required: true,
		lowercase: true,
		trim: true
	},
	provider: {
		type: String,
		minlength: 2,
		maxlength: 16,
		required: true,
		lowercase: true,
		trim: true
	},
	providerId: {
		type: String,
		minlength: 2,
		maxlength: 266,
		required: true,
		trim: true
	},
	accessData: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	lastLoginAt: {
		type: Date,
		default: Date.now
	}
}, {
	collection: [PREFIX, 'AccountConnections'].join('')
});

// settings: ==============

Account.set('toObject', {
	getters: true
});
AccountConnection.set('toObject', {
	getters: true
});
App.set('toObject', {
	getters: true
});


// exports: ===============
exports.Account = Account;
exports.AccountConnection = AccountConnection;
exports.App = App;
exports.NAMES = NAMES;
