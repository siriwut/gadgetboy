'use strict';

angular.module('orders-manager').factory('ordersCounter', ['$q', 'Orders','orderStatus',
	function($q, Orders, orderStatus) {

		var ordersQty = {};

		var statuses = orderStatus.statuses;

		return {
			countAll: countAll
		};

		function countAll() {
			statuses.forEach(function(status) {
				var defer = $q.defer();
				
				Orders.count({ status: status }, function(result){
					defer.resolve(result);
				}, function(err) {
					defer.reject(err);
				});

				ordersQty[status] = defer.promise;
			});

			return $q.all(ordersQty);		
		}

		function count(status) {
			return Orders.count({ status: status || '' }).$promise;	
		}

	}
	]);