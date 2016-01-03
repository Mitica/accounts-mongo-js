'use strict';

module.exports = function(storage) {
	return {
		create: function(data) {
			return storage.control.createApp(data);
		}
	};
};
