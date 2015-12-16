'use strict';

angular.module('orders').factory('orderService', ['$q', 'Products', 
	function($q, Products) {
		var _self = this;
		
		_self.Order = {};
		
		return {
			create: create,
			addProductsQtyByOrder: addProductsQtyByOrder,
			minusProductsQtyByOrder: minusProductsQtyByOrder
		};

		function create(Order) {
			_self.Order = Order;
		}

		function addProductsQtyByOrder() {
			if(!_self.Order) {
				throw new Error('Order not undefined.');
			}

			var products = [];
			var orderProducts = _self.Order.products;

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
			if(!_self.Order) {
				throw new Error('Order not undefined.');
			}

			var products = [];
			var orderProducts = _self.Order.products;

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