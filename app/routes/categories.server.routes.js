'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categories = require('../../app/controllers/categories.server.controller');

	// Categories Routes
	app.route('/api/categories')
		.get(categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/api/categories/:categoryId')
		.get(categories.read)
		.put(users.requiresLogin,users.hasAuthorization(['admin']), categories.update)
		.delete(users.requiresLogin,users.hasAuthorization(['admin']), categories.delete);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};
