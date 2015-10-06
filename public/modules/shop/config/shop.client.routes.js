'use strict';

//Setting up route
angular.module('shop').config(['$stateProvider',
	function($stateProvider) {
		// Shop state routing
		$stateProvider.
		state('product', {
			url: '/product/:productId',
			templateUrl: 'modules/shop/views/product-profile.client.view.html'
		}).
		state('productCategory', {
			url: '/product-category/:categoryId',
			templateUrl: 'modules/shop/views/product-category.client.view.html'
		});
	}
]);