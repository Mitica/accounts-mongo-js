'use strict';

var _ = require('./utils')._;

function mongoGetItem(data, nofields) {

	function mapItem(item) {
		return mongoGetItem(item, nofields);
	}

	var _id = data._id;

	data = _.isFunction(data.toObject) ? data.toObject() : data;
	for (var prop in data) {
		if (prop === 'id' && _.isNumber(_id)) {
			data[prop] = parseInt(data[prop]);
		} else if (data[prop] === null || nofields.indexOf(prop) > -1) {
			delete data[prop];
		} else if (Array.isArray(data[prop])) {
			data[prop] = data[prop].map(mapItem);
		}
	}
	return data;
}

module.exports = function mongoGet(data, nofields) {
	nofields = nofields || ['_id', '__v', '_username'];
	if (!Array.isArray(nofields)) {
		nofields = [nofields];
	}

	if (data && data.toObject) {
		return mongoGetItem(data, nofields);
	}
	if (data && Array.isArray(data)) {
		return data.map(function(item) {
			return mongoGetItem(item, nofields);
		});
	}
	return data;
};
