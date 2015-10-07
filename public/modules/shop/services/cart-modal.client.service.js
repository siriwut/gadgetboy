'use strict';

angular.module('shop').factory('CartModal', ['$modal',
	function($modal) {

		return {
			open: function(cartWithProducts) {
			
				var cart = $modal.open({
					animation:true,
					templateUrl:'cartModal.html',
					controller: 'cartModalCtrl',
					size:'lg',
					resolve:{
						cartWithProducts:function(){
							return cartWithProducts;
						}
					}
				});
			}
		};
	}
]);