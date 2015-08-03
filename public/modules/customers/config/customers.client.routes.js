'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('customer-panel', {
			url: '/customer-panel',
			templateUrl: 'modules/customers/views/customer-panel.client.view.html'
		});
	}
]);