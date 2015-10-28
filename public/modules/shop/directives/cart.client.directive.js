'use strict';

angular.module('shop')
.controller('cartModalCtrl',['$scope', '$http','$state', '$modalInstance', 'cartWithProducts', 'Flash', 'CartCalculator', 'Authentication',function($scope ,$http, $state , $modalInstance, cartWithProducts, Flash, CartCalculator, Authentication){
	var exceptShippingCost = 1000;
	$scope.authentication = Authentication;
	$scope.productsInCart = [];
	$scope.totalPrice = 0;
	$scope.shippingCost = 0;

	$scope.initCart = function(){
		if(cartWithProducts){
			$scope.productsInCart = cartWithProducts;	

		}else{

			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data;
			},function(err){
				$scope.err = err.data.message;
			});
		}

	};

	$scope.pay = function(){
		if(!$scope.authentication.user) {
			$modalInstance.dismiss('cancel');
			
			return $state.go('checkout.signin');
		}
	};

	$scope.dismiss = function(){
		$modalInstance.dismiss('cancel');
	};



	$scope.deleteProduct = function(product,event){
		if(!product) return;

		$http.delete('/api/carts/delete/'+product._id).then(function(res){
			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data;
				$scope.$emit('cartChange');
			},function(err){
				$scope.err = err.data.message;
			});
		},function(err){

		});
	};


	$scope.$watch('productsInCart',function(){

		$scope.totalQuantity = CartCalculator.totalQuantity($scope.productsInCart);
		$scope.totalPrice = CartCalculator.totalPrice($scope.productsInCart, $scope.shippingCost, exceptShippingCost);
		$scope.$emit('cartChange');
	});

	$scope.$watch('totalPrice', function(){
		$scope.shippingCost = $scope.totalPrice <= exceptShippingCost? 50: 0;
		$scope.totalPrice = CartCalculator.totalPrice($scope.productsInCart, $scope.shippingCost, exceptShippingCost);
	});

	$scope.$on('cartUpdated',function(){
		$http.get('/api/carts/show').then(function(response){
			$scope.productsInCart = response.data;
		},function(err){
			$scope.err = err.data.message;
		});
	});

	$scope.$on('modal.closing',function(){
		Flash.dismiss();
	});



}])
.directive('cart', [
	function() {
		return {
			templateUrl:'../../modules/shop/directives/templates/cart.html',
			restrict: 'EA'
		};
	}
	]);


