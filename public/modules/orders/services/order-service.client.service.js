'use strict';

angular.module('orders').factory('orderService', ['Products',
	function(Products) {
		var _self = this;
		
		_self.Order = {};
		
		return {
			init: init,
			decreaseProductsQty: decreaseProductsQty
		};

		function init(Order) {
			_self.Order = Order;
		}

		function decreaseProductsQty() {
			if(!_self.Order) {
				throw new Error('Order not undefined.');
			}

			var orderProducts = _self.Order.orders.products;

			orderProducts.forEach(function(val, key) {
				console.log(val + ' ' + key);
			});
		}
	}
	]);