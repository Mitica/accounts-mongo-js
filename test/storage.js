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
});
