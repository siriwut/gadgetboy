'use strict';

angular.module('shop')
.controller('cartModalCtrl',['$scope','$modalInstance','cartWithProducts',function($scope, $modalInstance,cartWithProducts){
	$scope.productsInCart = cartWithProducts;
	
	$scope.dismiss = function(){
		$modalInstance.dismiss('cancel');
	};
}])
.directive('cart', [
	function() {
		return {
			templateUrl:'../../modules/shop/directives/cart.html',
			restrict: 'EA',
			link: function (scope, element, attrs) {
				//console.log('this is the cart directive');
			}
		};
	}
]);