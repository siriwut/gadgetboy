'use strict';

//Setting up route
angular.module('customer-panel').config(['$stateProvider',
	function($stateProvider) {
		// Customer panel state routing
		$stateProvider.
		state('customerPanel.confirmPayment', {
			url: '/payconfirm/:orderId',
			templateUrl: 'modules/customer-panel/views/orders/confirm-payment.client.view.html',
			controller: 'CustomerOrdersCtrl as co'
		}).
		state('customerPanel.listOrders', {
			url: '/list-orders',
			templateUrl: 'modules/customer-panel/views/orders/list-orders.client.view.html',
			controller: 'CustomerOrdersCtrl as co'
		}).
		state('customerPanel', {
			url: '/customer-panel',
			templateUrl: 'modules/customer-panel/views/panel/panel.client.view.html',
			controller: 'CustomerPanelCtrl as cp'
		});
	}
]);