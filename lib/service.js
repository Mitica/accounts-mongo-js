'use strict';

var assert = require('assert');
var utils = require('./utils');
var get = require('./mongo_get');
var Promise = utils.Promise;
var _ = utils._;
var models = require('./db/schemas').NAMES;

var Service = module.exports = function Service(db) {
	this.db = db;
};

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

// --- access

Service.prototype.one = function(model, params) {
	checkModel(model);
	assert.ok(params);

	return this.db[model].findOneAsync(params.where, params.select).then(get);
};

Service.prototype.count = function(model, params) {
	checkModel(model);
	params = params || {};

	return this.db[model].countAsync(params.where);
};

Service.prototype.list = function(model, params) {
	checkModel(model);
	assert.ok(params);

	var self = this,
		limit = 10;
	params = _.pick(params, 'where', 'limit', 'order', 'select', 'offset');
	if (params.limit && (params.limit < 1 || params.limit > 200)) {
		delete params.limit;
	}

	var sort = [];
	if (_.isString(params.order)) {
		params.order.split(/[ ,;]+/g).forEach(function(name) {
			if (name.length < 2) {
				return;
			}
			if (name[0] === '-') {
				sort.push([name.substr(1), -1]);
			} else {
				sort.push([name, 1]);
			}
		});
	}

	return new Promise(function(resolve, reject) {
		self.db[model]
			.find(params.where)
			.select(params.select)
			.sort(sort)
			.skip(params.offset || 0)
			.limit(params.limit || limit)
			.exec(function(error, list) {
				if (error) {
					return reject(error);
				}
				list = get(list);
				resolve(list);
			});
	});
};

// --- control

/**
 * Create item
 */
Service.prototype.create = function(model, data) {
	checkModel(model);
	assert.ok(data);
	data._id = data._id || data.id;

	delete data.id;

	return this.db[model].createAsync(data).then(get);
};

/**
 * Update item
 */
Service.prototype.update = function(model, data) {
	checkModel(model);
	assert.ok(data);

	var id = data.id || data._id;

	delete data.id;

	return this.db[model].findByIdAndUpdateAsync(id, data).then(get);
};

/**
 * Update item
 */
Service.prototype.updateItems = function(model, where, data) {
	checkModel(model);
	assert.ok(data);

	return this.db[model].updateAsync(where, data, {
		multi: true
	}).then(get);
};

/**
 * Remove item
 */
Service.prototype.remove = function(model, where) {
	checkModel(model);
	assert.ok(where);

	return this.db[model].removeAsync(where).then(get);
};
