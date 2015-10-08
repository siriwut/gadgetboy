'use strict';

angular.module('shop').directive('addToCart', ['$http','$state','CartModal','Flash',
	function($http,$state,CartModal,Flash) {
		return {
			scope:{
				productId:'@',
				quantity:'@'
			},
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('click',function(event){

					if(!(scope.productId && scope.quantity) )
						throw 'addToCart and Quantity argument cannot be undefined';

					if(!angular.isString(scope.productId))
						throw 'addToCart argument must be String';
					if(!angular.isNumber(parseInt(scope.quantity)))
						throw 'Quantity argument must be Number';

					$http.post('/api/carts/add',{productId:scope.productId,quantity:parseInt(scope.quantity)})
					.then(function(response){
						CartModal.open(response.data);
					},function(err){
						Flash.create('warning',err.data.message);
						CartModal.open();
					});
				});
			}
		};
	}
]);