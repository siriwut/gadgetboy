'use strict';

angular.module('shop').controller('CartCtrl', ['$scope','$http','Flash','CartCalculator',
	function($scope ,$http ,Flash,CartCalculator) {

		$scope.productsInCart = [];
		$scope.totalPrice = 0;


		$scope.initCart = function(){

			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data || [];
			},function(err){
				$scope.err = err.data.message;
			});


		};

		$scope.$watch('productsInCart',function(){
			$scope.totalPrice = CartCalculator.totalPrice($scope.productsInCart);
		});

		$scope.$on('cartUpdated',function(){
			$http.get('/api/carts/show').then(function(response){
				$scope.productsInCart = response.data;
			},function(err){
				$scope.err = err.data.message;
			});
		});


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



		$scope.$on('modal.closing',function(){
			Flash.dismiss();
		});
	}
	]);