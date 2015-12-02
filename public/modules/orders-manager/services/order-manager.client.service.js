'use strict';

angular.module('orders-manager').factory('orderManager', [
	function() {
		var self = this;
		var order;

		var orderManager = {
			init: init,
			getTotalProductsQty: getTotalProductsQty
		};

		return orderManager;

		function init(order) {
			self.order = order;
		}

		function getTotalProductsQty() {
			var total = 0;
			var i;

			for(i = 0; i < self.order.products.length; i++) {
				total += self.order.products[i].quantity;
			}

			return total;
		}
	}
]);