'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('checkout.complete', {
			url: '/step/complete/:orderId',
			templateUrl: 'modules/orders/views/checkout.complete.client.view.html'
		}).
		state('checkout.shippingandpayment', {
			url: '/step/shippingandpayment',
			templateUrl: 'modules/orders/views/checkout.shippingandpayment.client.view.html'
		}).
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