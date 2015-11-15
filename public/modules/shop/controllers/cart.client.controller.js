'use strict';

angular.module('shop').controller('CartCtrl', ['$scope', '$http','$state', 'Authentication', 'Flash', 'CartCalculator',
	function($scope , $http , $state, Authentication, Flash, CartCalculator) {

		var exceptShippingCost = 1000;

		$scope.authentication = Authentication;
		$scope.productsInCart = [];
		$scope.totalPrice = 0;
		$scope.shippingCost = 0;
		$scope.netTotalPrice = 0;
		$scope.paymentExtraCost = 0;

		$scope.initCart = function(){
			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data || [];
			},function(err){
				$scope.err = err.data.message;
			});
		};

		$scope.pay = function(){
			if(!$scope.authentication.user) {
				return $state.go('checkout.signin');
			}

			$state.go('checkout.shippingandpayment');
		};

		$scope.deleteProduct = function(product,event){
			if(!product) return;

			$http.delete('/api/carts/delete/'+product._id).then(function(res){
				$http.get('/api/carts/show').then(function(response){
					$scope.productsInCart = response.data;
				},function(err){
					$scope.err = err.data.message;
				});
			},function(err){

			});	

		};

		$scope.$watch('productsInCart',function(){
			$scope.totalQuantity = CartCalculator.totalQuantity($scope.productsInCart);
			$scope.totalPrice = CartCalculator.totalPrice($scope.productsInCart);
			$scope.netTotalPrice = CartCalculator.netTotalPrice($scope.totalPrice, $scope.shippingCost, exceptShippingCost);
			$scope.$emit('cartChange');
		});

		$scope.$watch('totalPrice', function(){
			$scope.shippingCost = $scope.totalPrice <= exceptShippingCost? 50: 0; 
		});

		$scope.$on('cartUpdated',function(){
			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data;
			},function(err){
				$scope.err = err.data.message;
			});
		});	

		$scope.$on('hasExtraCost', function(e, value){
			$scope.netTotalPrice -= $scope.paymentExtraCost;
			$scope.paymentExtraCost = value;
			$scope.netTotalPrice += $scope.paymentExtraCost;
			
		});

		$scope.$watch('netTotalPrice', function(newValue, oldValue){
			$scope.$emit('netTotalPriceChange', newValue);
		});
		
	}
	]);