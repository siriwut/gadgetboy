'use strict';

var shop = require('../../app/controllers/shop.server.controller');

module.exports = function(app) {
	app.route('/api/shop/catalog/:categoryId')
	.get(shop.listProductByCategory);


	app.param('categoryId',shop.productByCategoryID);
};