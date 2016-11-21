'use strict';

const Service = require('./service');
const utils = require('./utils');

module.exports = class ServiceWrapper extends Service {

	create(appId, model, data) {

		const wdata = {
			_id: utils.formatKey(appId, data.id),
			appId: appId,
			data: data,
			createdAt: new Date(data.createdAt || Date.now()).getTime()
		};

		if (data.updatedAt) {
			wdata.updatedAt = new Date(data.updatedAt).getTime();
		}
		if (data.lastLoginAt) {
			wdata.lastLoginAt = new Date(data.lastLoginAt).getTime();
		}

		if (model === 'Identity') {
			data.userId = utils.formatKey(appId, data.userId);
		}

		return super.create(model, wdata);
	}

	update(appId, model, data) {

		const wdata = {
			id: utils.formatKey(appId, data.id),
			data: data,
			updatedAt: new Date(data.updatedAt || Date.now()).getTime()
		};

		if (data.lastLoginAt) {
			wdata.lastLoginAt = new Date(data.lastLoginAt).getTime();
		}

		return super.update(model, wdata);
	}

	getById(appId, model, id) {
		return super.one(model, {
			where: {
				_id: utils.formatKey(appId, id)
			}
		});
	}

};
