'use strict';

var accounts = require('./common/accounts');
var assert = require('assert');

if (!accounts) {
	return;
}

describe('api', function() {
	var api = accounts.api(process.env.APP_ID);

	it('should login with provider', function() {
		return api.providerLogin({
			name: 'Test'
		}).then(function(account) {
			console.log('account', account);
		});
	});
});
