'use strict';

angular.module('shop').directive('addToCart', ['$http','CartModal',
	function($http,CartModal) {
		return {
			scope:true,
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('click',function(event){
					if(!attrs.addToCart)
						throw 'addToCart cannot be undefined';

					if(!angular.isString(scope.$eval(attrs.addToCart)))
						throw 'addToCart argument must be String';
						

					$http.post('/api/carts/add',{productId:scope.$eval(attrs.addToCart)})
					.success(function(cart){
						CartModal.open(cart);
					}).error(function(err){

					});
				});
			}
		};
	}
]);