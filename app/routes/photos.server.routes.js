'use strict';


var users = require('../../app/controllers/users.server.controller'),
	photos = require('../../app/controllers/photos.server.controller');

module.exports = function(app) {
	app.route('/api/photos').
	post(users.requiresLogin,users.hasAuthorization(['admin']),photos.create);

	app.route('/api/photos/:photoId').
	delete(users.requiresLogin,users.hasAuthorization(['admin']),photos.delete);

	app.param('photoId',photos.photoByID);
};