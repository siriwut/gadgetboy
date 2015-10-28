'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('checkout.signin', {
			url: '/step/signin',
			templateUrl: 'modules/orders/views/checkout.signin.client.view.html'
		}).
		state('checkout', {
			url: '/checkout',
			templateUrl: 'modules/orders/views/checkout.client.view.html'
		});
	}
]);