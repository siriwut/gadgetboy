'use strict';

var users = require('../../app/controllers/users.server.controller');
var orders = require('../../app/controllers/orders.server.controller');


module.exports = function(app) {
	app.route('/api/orders')
	.post(users.hasAuthorization(['user', 'admin']), users.requiresLogin, orders.add)
	.get(users.hasAuthorization(['admin']), users.requiresLogin, orders.list);

	app.route('/api/orders/:orderId').get(orders.read);
};
