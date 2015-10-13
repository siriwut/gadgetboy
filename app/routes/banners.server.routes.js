'use strict';

var users = require('../../app/controllers/users.server.controller');
var banners = require('../../app/controllers/banners.server.controller');

module.exports = function(app) {
	app.route('/api/banners')
	.get(banners.list)
	.post(users.requiresLogin,users.hasAuthorization(['admin']),banners.add);

	app.route('/api/banners/:bannerId')
	.delete(users.requiresLogin,users.hasAuthorization(['admin']),banners.remove);

	app.param('bannerId',banners.bannerById);
	
};