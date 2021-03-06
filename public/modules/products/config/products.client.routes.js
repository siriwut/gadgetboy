'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {

		// Products state routing
		$stateProvider.
		state('adminPanel.createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('adminPanel.listProducts', {
			url: '/products/:productBy',
			templateUrl: 'modules/products/views/list-product.client.view.html'
		}).
		state('adminPanel.editProduct', {
			url: '/products/edit/:productId',
			templateUrl: 'modules/products/views/edit-product.client.view.html'
		});
	}
]);