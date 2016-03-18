'use strict';

var storage = require('./common/storage');
var assert = require('assert');

if (!storage) {
	return;
}

describe('storage', function() {
	it('should create app with a name', function() {
		return storage.apps.create({
			name: 'Test'
		}).then(function(app) {
			assert.ok(app);
			assert.equal('Test', app.name);
		});
	});

	it('should throw an error', function() {
		try {
			storage.apps.create();
		} catch (e) {
			assert.ok(e);
			return;
		}
		throw new Error('Error');
	});

	it('should throw an error invalid data', function() {
		return storage.apps.create({})
			.catch(function(error) {
				assert.ok(error);
			}).then(function(app) {
				assert.equal(undefined, app);
			});
	});
});
