'use strict';
var multipart = require('connect-multiparty'),
multipartMiddleware = multipart({autoFiles:true,uploadDir:'./public/photos_upload/'});

var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/api/articles')
		.get(articles.list)
		.post(users.hasAuthorization(['user','admin']), articles.create);

	app.route('/api/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};