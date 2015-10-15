'use strict';

var shop = require('../../app/controllers/shop.server.controller');

module.exports = function(app) {
	app.route('/api/shop/catalog/:categorySlug')
	.get(shop.listProductByCategory);

	app.route('/api/shop/wall').get(shop.displayWall);

};