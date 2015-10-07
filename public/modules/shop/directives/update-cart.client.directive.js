'use strict';

angular.module('shop').directive('updateCart', ['$http','Flash',
	function($http,Flash) {
		return {
			scope:true,
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('change',function(){
					if(!attrs.updateCart)
						throw 'productId cannot be undefined';
					//if(angular.isString(scope.$evattrs.updateCart)
					if(!angular.isString(attrs.updateCart))
						throw 'productId must be String';

					$http.put('/api/carts/edit',{productId:attrs.updateCart,quantity:this.value})
					.then(function(res){
						scope.$emit('cartUpdated',res);
					},function(err){
						Flash.create('danger',err.data.message);
					});
				});
			}
		};
	}
]);