'use strict';

//Setting up route
angular.module('shop').config(['$stateProvider',
	function($stateProvider) {
		// Shop state routing
		$stateProvider.
		state('cart', {
			url: '/cart',
			templateUrl: 'modules/shop/views/cart.client.view.html'
		}).
		state('product', {
			url: '/product/:productSlug',
			templateUrl: 'modules/shop/views/product-profile.client.view.html'
		}).
		state('productCategory', {
			url: '/product-category/:categorySlug',
			templateUrl: 'modules/shop/views/product-category.client.view.html'
		});
	}
]);