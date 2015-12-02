'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('/api/orders/:orderId', 
		{ 
			orderId: '@orders._id'
		}, 
		{
			update: {
				method: 'PUT'
			},
			count: {
				url: '/api/orders/count',
				method: 'GET'
			},
			remove: {
				url: '/api/orders/:customerId/:orderId',
				method: 'DELETE'
			}
		});
	}
	]);