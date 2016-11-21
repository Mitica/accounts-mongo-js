'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NAMES = ['User', 'Identity'];
const envs = require('../envs');
const PREFIX = envs.collectionPrefix || '';

const User = new Schema({
	// hash(appId:accounts_id)
	_id: String,
	appId: {
		type: String,
		required: true,
		index: true,
		minlength: 16,
		maxlength: 40
	},

	data: Schema.Types.Mixed,

	updatedAt: {
		type: Number,
		default: Date.now,
		required: true
	},
	lastLoginAt: {
		type: Number
	},
	createdAt: {
		type: Number,
		required: true,
		index: true,
		default: Date.now
	}
}, {
	collection: [PREFIX, 'users'].join(''),
	strict: false
});

const Identity = new Schema({
	// hash(appId:accounts_id)
	_id: String,
	appId: {
		type: String,
		required: true,
		index: true,
		minlength: 16,
		maxlength: 40
	},
	// hash(appId:accounts_userId)
	userId: {
		type: String,
		required: true,
		index: true,
		minlength: 36,
		maxlength: 40
	},

	data: Schema.Types.Mixed,

	updatedAt: {
		type: Number,
		default: Date.now,
		required: true
	},
	lastLoginAt: {
		type: Number
	},
	createdAt: {
		type: Number,
		required: true,
		index: true,
		default: Date.now
	}
}, {
	collection: [PREFIX, 'identities'].join(''),
	strict: false
});

// settings: ==============

User.set('toObject', {
	getters: true
});
Identity.set('toObject', {
	getters: true
});


// exports: ===============
exports.User = User;
exports.Identity = Identity;
exports.NAMES = NAMES;
