'use strict';

exports._ = require('lodash');
var crypto = require('crypto');
exports.Promise = require('bluebird');
exports.atonic = require('atonic');
exports.uuid = require('uuid').v4;
exports.randomString = require('randomstring').generate;
exports.md5 = function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex').toLowerCase();
};
