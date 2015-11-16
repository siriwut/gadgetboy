'use strict';

var users = require('../../app/controllers/users.server.controller');
var orders = require('../../app/controllers/orders.server.controller');


module.exports = function(app) {
	app.route('/api/orders')
	.post(users.hasAuthorization(['user', 'admin'], orders.add, users.requiresLogin))
	.get(users.hasAuthorization(['admin']), orders.list, users.requiresLogin);

	app.route('/api/orders/:orderId').get(orders.read);
};
