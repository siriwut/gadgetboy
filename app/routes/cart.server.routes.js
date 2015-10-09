'use strict';
var carts = require('../../app/controllers/carts.server.controller'),
 users = require('../../app/controllers/users.server.controller');


module.exports = function(app) {
	app.route('/api/carts/add').post(carts.add);
	app.route('/api/carts/show').get(carts.list);
	app.route('/api/carts/edit').put(carts.edit);
	app.route('/api/carts/delete/:productId').delete(carts.delete);

};