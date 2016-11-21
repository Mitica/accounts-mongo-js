'use strict';

exports._ = require('lodash');
exports.Promise = require('bluebird');

const crypto = require('crypto');

const sha1 = exports.sha1 = function(value) {
	return crypto.createHash('sha1').update(value).digest('hex').toLowerCase();
};

exports.formatKey = function formatKey(appId, id) {
	return sha1([appId.trim(), id.trim()].join('|'));
};
