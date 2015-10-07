'use strict';

angular.module('shop')
.controller('cartModalCtrl',['$scope','$http','$modalInstance','cartWithProducts','Flash',function($scope ,$http , $modalInstance,cartWithProducts,Flash){
	
	$scope.seletedQuantity = [];

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

	$scope.$on('cartUpdated',function(){
		$http.get('/api/carts/show').then(function(response){
			$scope.productsInCart = response.data;
		},function(err){
			$scope.err = err.data.message;
		});
	});


	$scope.dismiss = function(){
		$modalInstance.dismiss('cancel');
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



	$scope.$on('modal.closing',function(){
		Flash.dismiss();
	});



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


