'use strict';

angular.module('customers-manager').factory('Customers', ['$resource',
	function($resource) {

		return $resource('/api/customers/:customerId',{
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);