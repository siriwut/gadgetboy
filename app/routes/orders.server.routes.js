'use strict';

var users = require('../../app/controllers/users.server.controller');
var orders = require('../../app/controllers/orders.server.controller');


module.exports = function(app) {
	app.route('/api/orders')
	.post(users.hasAuthorization(['user', 'admin']), users.requiresLogin, orders.add)
	.get(users.hasAuthorization(['admin']), users.requiresLogin, orders.list);

	app.route('/api/orders/count')
	.get(users.hasAuthorization(['admin']), users.requiresLogin, orders.count);

	app.route('/api/orders/users')
	.get(users.hasAuthorization(['user','admin']), users.requiresLogin, orders.listByUser);

	app.route('/api/orders/confirm')
	.put(users.hasAuthorization(['user','admin']), users.requiresLogin, orders.confirmPaid);

	app.route('/api/orders/:orderId')
	.get(users.hasAuthorization(['user','admin']), users.requiresLogin, orders.read)
	.put(users.hasAuthorization(['admin']), users.requiresLogin, orders.update);

	app.route('/api/orders/:orderId/customers/:custId')
	.delete(users.hasAuthorization(['admin']), users.requiresLogin, orders.remove);
};
