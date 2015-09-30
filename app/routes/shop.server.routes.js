'use strict';

var shop = require('../../app/controllers/shop.server.controller');

module.exports = function(app) {
	app.route('/api/shop/catalog/:catelogId')
	.get(shop.listProductByCategory);


	app.param('catelogId',shop.productByCategoryID);
};