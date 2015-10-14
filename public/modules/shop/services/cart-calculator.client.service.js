'use strict';

angular.module('shop').factory('CartCalculator', [
	function() {
		return {
			totalPrice: function(cart) {
				if(!cart)
					throw 'Cart not undefined';
				if(!angular.isArray(cart))
					throw 'Cart must be Array';

				console.log(cart);

				var total = 0;

				angular.forEach(cart,function(value,key){
					total+= value.quantity * (value.product.sale.onSale? value.product.sale.salePrice :value.product.price);
				});

				return total;
			}
		};
	}]);