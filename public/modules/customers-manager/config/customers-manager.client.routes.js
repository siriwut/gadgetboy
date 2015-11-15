'use strict';

//Setting up route
angular.module('customers-manager').config(['$stateProvider',
	function($stateProvider) {
		// Customers manager state routing
		$stateProvider.
		state('adminPanel.listCustomers', {
			url: '/list-customers',
			templateUrl: 'modules/customers-manager/views/list-customers.client.view.html'
		});
	}
]);