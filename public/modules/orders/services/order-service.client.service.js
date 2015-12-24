'use strict';

angular.module('orders').factory('orderService', ['$q', 'Products', 
	function($q, Products) {
		var _self = this;
		
		_self.order = {};
		
		return {
			create: create,
			addProductsQtyByOrder: addProductsQtyByOrder,
			minusProductsQtyByOrder: minusProductsQtyByOrder
		};

		function create(order) {
			_self.order = order;
		}

		function addProductsQtyByOrder() {
			if(!_self.order) {
				throw new Error('Order not undefined.');
			}

			var products = [];
			var orderProducts = _self.order.products;

			orderProducts.forEach(function(val, key) {
				var defer = $q.defer();
				var newQty = val.product.quantity + val.quantity;

				Products
				.update({ productId: val.product._id }, { quantity: newQty }, function(res) {
					defer.resolve(res);
				}, function(err) {
					defer.reject(err);
				});

				products.push(defer.promise);
			});

			return $q.all(products);
		}

		function minusProductsQtyByOrder() {
			if(!_self.order) {
				throw new Error('order not undefined.');
			}

			var products = [];
			var orderProducts = _self.order.products;

			orderProducts.forEach(function(val, key) {
				var defer = $q.defer();
				var newQty = val.product.quantity - val.quantity;

				Products
				.update({ productId: val.product._id }, { quantity: newQty }, function(res) {
					defer.resolve(res);
				}, function(err) {
					defer.reject(err);
				});

				products.push(defer.promise);
			});

			return $q.all(products);
		}
	}
	]);