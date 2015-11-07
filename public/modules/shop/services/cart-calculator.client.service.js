'use strict';

angular.module('shop').factory('CartCalculator', [
	function() {
		return {
			netTotalPrice: function(total, cost, exceptCostPrice) {
				if(cost){
					total +=  exceptCostPrice >= total? cost : 0;
				}

				return total;
			},
			totalPrice: function(cart) {
				if(!cart)
					throw 'Cart not undefined';
				if(!angular.isArray(cart))
					throw 'Cart must be Array';
				
				var total = 0;

				angular.forEach(cart, function(value, key){
					total+= value.quantity * (value.product.sale.onSale? value.product.sale.salePrice :value.product.price);
				});

				return total;
			},
			totalQuantity: function(cart) {
				if(!cart)
					throw 'Cart not undefined';
				if(!angular.isArray(cart))
					throw 'Cart must be Array';

				var total = 0;

				angular.forEach(cart, function(value){
					total += value.quantity;
				});

				return total;
			}
		};
	}]);