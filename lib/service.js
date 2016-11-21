'use strict';

const assert = require('assert');
const utils = require('./utils');
const get = require('./mongo_get');
const Promise = utils.Promise;
const _ = utils._;
const models = require('./db/schemas').NAMES;

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

module.exports = class Service {
	constructor(db) {
		this.db = db;
	}

	// --- access

	one(model, params) {
		checkModel(model);
		assert.ok(params);

		return this.db[model].findOneAsync(params.where, params.select).then(get);
	}

	count(model, params) {
		checkModel(model);
		params = params || {};

		return this.db[model].countAsync(params.where);
	}

	list(model, params) {
		checkModel(model);
		assert.ok(params);

		let limit = 10;
		params = _.pick(params, 'where', 'limit', 'order', 'select', 'offset');
		if (params.limit && (params.limit < 1 || params.limit > 200)) {
			delete params.limit;
		}

		const sort = [];
		if (_.isString(params.order)) {
			params.order.split(/[ ,;]+/g).forEach((name) => {
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

		return new Promise((resolve, reject)=> {
			this.db[model]
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
	}

	// --- control

	/**
	 * Create item
	 */
	create(model, data) {
		checkModel(model);
		assert.ok(data);
		data._id = data._id || data.id;

		delete data.id;

		return this.db[model].createAsync(data).then(get);
	}

	/**
	 * Update item
	 */
	update(model, data) {
		checkModel(model);
		assert.ok(data);

		const id = data.id || data._id;

		delete data.id;

		return this.db[model].findByIdAndUpdateAsync(id, data).then(get);
	}

	/**
	 * Update item
	 */
	updateItems(model, where, data) {
		checkModel(model);
		assert.ok(data);

		return this.db[model].updateAsync(where, data, {
			multi: true
		}).then(get);
	}

	/**
	 * Remove item
	 */
	remove(model, where) {
		checkModel(model);
		assert.ok(where);

		return this.db[model].removeAsync(where).then(get);
	}

};
