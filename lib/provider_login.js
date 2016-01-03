'use strict';

var UserProfile = require('./user_profile');
var helpers = require('./helpers');
var newUsername = require('./new_username');

function findAccountConnection(Data, profile) {
	var accountConnection = UserProfile.convertToAccountConnection(profile);
	accountConnection.id = helpers.createAccountConnectonId(Data.appId, accountConnection.provider, accountConnection.providerId);
	return Data.access.accountConnection({
		where: {
			_id: accountConnection.id
		}
	});
}

function logged(Data, account, connection) {
	return Promise.all([
		Data.control.updateAccount({
			id: account.id,
			lastLoginAt: Date.now()
		}),
		Data.control.updateAccountConnection({
			id: connection.id,
			lastLoginAt: Date.now()
		})
	]).then(function() {
		return account;
	});
}

function login(Data, profile, accessData) {
	return findAccountConnection(Data, profile, accessData)
		.then(function(connection) {
			if (connection) {
				console.log('found connection', connection);
				return Data.access.account({
					where: {
						_id: connection.accountId
					}
				}).then(function(account) {
					return logged(Data, account, connection);
				});
			}
			console.log('NOT found connection', connection);
			return newUsername(Data.appId, profile)
				.then(function(username) {
					var accountInfo = UserProfile.convertToAccount(profile);
					accountInfo.username = username;
					accountInfo.appId = Data.appId;

					console.log('creating account', accountInfo);

					return Data.control.createAccount(accountInfo)
						.then(function(account) {
							var connectionInfo = UserProfile.convertToAccountConnection(profile);
							connectionInfo.appId = Data.appId;
							connectionInfo.accountId = account.id;
							connectionInfo.accessData = accessData;

							console.log('creating connection', connectionInfo);

							return Data.control.createAccountConnection(connectionInfo)
								.then(function() {
									return account;
								});
						});
				});
		});
}

module.exports = function providerLoginCreator(Data) {

	function providerLogin(profile, accessData) {
		if (!accessData) {
			return Promise.reject(new Error('accessData is required'));
		}
		if (typeof accessData !== 'string') {
			accessData = JSON.stringify(accessData);
		}
		return login(Data, profile, accessData);
	}

	return providerLogin;
};
