'use strict';

//Setting up route
angular.module('orders-manager').config(['$stateProvider',
	function($stateProvider) {
		// Orders manager state routing
		$stateProvider.
		state('adminPanel.viewOrder', {
			url: '/view-order/:status/:orderId',
			templateUrl: 'modules/orders-manager/views/view-order.client.view.html'
		}).
		state('adminPanel.listOrders', {
			url: '/list-orders/:status',
			templateUrl: 'modules/orders-manager/views/list-orders.client.view.html'
		});
	}
]);