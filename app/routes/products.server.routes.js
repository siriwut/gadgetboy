'use strict';

var users = require('../../app/controllers/users.server.controller.js'), 
products = require('../../app/controllers/products.server.controller.js');


module.exports = function(app) {
	
	app.route('/api/products').
	get(products.list).
	post(users.requiresLogin,users.hasAuthorization(['admin']),products.create);

	app.route('/api/products/read-slug')
	.get(products.readBySlug);

	app.route('/api/products/quantity').
	get(products.getQuantity);



	app.route('/api/products/:productId').
	get(products.read).
	put(users.requiresLogin,users.hasAuthorization(['admin']),products.update).
	delete(users.requiresLogin,users.hasAuthorization(['admin']),products.delete);

	
	
	

	
};