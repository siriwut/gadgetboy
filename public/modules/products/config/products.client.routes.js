'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('product-detail', {
			url: '/product-detail',
			templateUrl: 'modules/products/views/product-detail.client.view.html'
		});
	}
]);