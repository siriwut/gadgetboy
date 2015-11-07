'use strict';

var users = require('../../app/controllers/users.server.controller');
var orders = require('../../app/controllers/orders.server.controller');


module.exports = function(app) {
	app.route('/api/orders').post(orders.add, users.requiresLogin, users.hasAuthorization(['user', 'admin']));
	app.route('/api/orders/:orderId').get(orders.read);
};
