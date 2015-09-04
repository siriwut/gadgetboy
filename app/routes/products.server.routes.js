'use strict';

var users = require('../../app/controllers/users.server.controller.js'), 
products = require('../../app/controllers/products.server.controller.js');


module.exports = function(app) {
	app.route('/api/products').
	get(products.list).
	post(users.hasAuthorization(['admin']),products.create);

	app.route('/api/products/:productId').
	get(products.read).
	delete(users.hasAuthorization(['admin']),products.delete).
	put(users.hasAuthorization(['admin']),products.update);
	


	app.param('productId',products.productByID);
};