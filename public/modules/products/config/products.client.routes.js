'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('admin-panel.create-product', {
			url: '/create-product',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('admin-panel.list-product', {
			url: '/list-product',
			templateUrl: 'modules/products/views/list-product.client.view.html'
		}).
		state('product-detail', {
			url: '/product-detail',
			templateUrl: 'modules/products/views/product-detail.client.view.html'
		});
	}
]);