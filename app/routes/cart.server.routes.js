'use strict';
var carts = require('../../app/controllers/carts.server.controller'),
 users = require('../../app/controllers/users.server.controller');


module.exports = function(app) {
	app.route('/api/carts/add').post(carts.add);
};