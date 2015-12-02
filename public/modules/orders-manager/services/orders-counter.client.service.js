'use strict';

angular.module('orders-manager').factory('ordersCounter', ['Orders',
	function(Orders) {

		
		
		return {
			count: count
		};

		function count(status , cb) {
			Orders
			.count({ status: status || '' })
			.$promise
			.then(function(res) {
				cb(res.count);
			});		 
		}
	}
	]);