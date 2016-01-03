'use strict';

var accounts = require('./common/accounts');
var assert = require('assert');

if (!accounts) {
	return;
}

describe('apps', function() {
	it('should create app with a name', function() {
		return accounts.apps.create({
			name: 'Test'
		}).then(function(app) {
			console.log('app', app);
		});
	});

	it('should throw an error', function() {
		try {
			accounts.apps.create();
		} catch (e) {
			assert.ok(e);
			return;
		}
		throw new Error('Error');
	});

	it('should throw an error invalid data', function() {
		return accounts.apps.create({})
			.catch(function(error) {
				assert.ok(error);
			}).then(function(app) {
				assert.equal(undefined, app);
			});
	});
});
