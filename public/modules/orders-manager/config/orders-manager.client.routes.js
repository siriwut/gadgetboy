'use strict';

//Setting up route
angular.module('orders-manager').config(['$stateProvider',
	function($stateProvider) {
		// Orders manager state routing
		$stateProvider.
		state('adminPanel.listOrders', {
			url: '/list-orders',
			templateUrl: 'modules/orders-manager/views/list-orders.client.view.html'
		});
	}
]);