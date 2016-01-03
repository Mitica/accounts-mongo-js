'use strict';

// var utils = require('./utils');
var get = require('./mongo_get');
var models = require('./schemas').NAMES;
var actions = ['create', 'update', 'remove'];
var assert = require('assert');
var normalize = require('./normalize');

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

function Service(db) {
	this.db = db;
}

/**
 * Create item
 */
Service.prototype.create = function(model, data) {
	checkModel(model);
	assert.ok(data);

	data = normalize.createModel(model, data);

	return this.db[model].createAsync(data).then(get);
};

/**
 * Update item
 */
Service.prototype.update = function(model, data) {
	checkModel(model);
	assert.ok(data);

	data.updatedAt = data.updatedAt || Date.now();
	return this.db[model].findByIdAndUpdateAsync(data.id, data).then(get);
};

/**
 * Update item
 */
Service.prototype.updateItems = function(model, where, data) {
	checkModel(model);
	assert.ok(data);

	data.updatedAt = data.updatedAt || Date.now();
	return this.db[model].updateAsync(where, data, {
		multi: true
	}).then(get);
};

/**
 * Remove item
 */
Service.prototype.remove = function(model, data) {
	checkModel(model);
	assert.ok(data);

	return this.db[model].removeAsync(data.where).then(get);
};

/**
 * Builds API
 */
models.forEach(function(model) {
	actions.forEach(function(action) {
		Service.prototype[action + model] = function(data) {
			return this[action](model, data);
		};
	});
	Service.prototype['update' + model + 's'] = function(where, data) {
		return this.updateItems(model, where, data);
	};
});

module.exports = Service;
