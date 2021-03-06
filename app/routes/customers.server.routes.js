'use strict';

var users = require('../../app/controllers/users.server.controller');
var customers = require('../../app/controllers/customers.server.controller');

module.exports = function(app) {
	

	// Customers Routes
	app.route('/api/customers')
	.get(customers.list)
	.post(users.requiresLogin, customers.create);

	app.route('/api/customers/users')
	.get(users.requiresLogin, users.hasAuthorization(['user' ,'admin']), customers.readByUser);

	app.route('/api/customers/:customerId')
	.get(customers.read)
	.put(users.requiresLogin, customers.hasAuthorization, customers.update)
	.delete(users.requiresLogin, users.hasAuthorization(['admin']), customers.delete);

	

	// Finish by binding the Customer middleware
	app.param('customerId', customers.customerByID);
};
