'use strict';

angular.module('shop').controller('ShopCtrl', ['$scope','$http','$stateParams','Products','Categories',
	function($scope,$http,$stateParams,Products,Categories) {
		
		$scope.selectedQuantity = 1;

		$scope.viewProductCategory = function(){

			$http.get('/api/shop/catalog/'+$stateParams.categorySlug)
			.then(function(response) {
				$scope.products = response.data;
			}, function(errorResponse) {
				console.log('Error');
			});

			//$scope.products = Products.query({categoryId:$stateParams.categoryId});	
		};

		
		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};

		$scope.findProduct = function(){
			$scope.product = Products.getBySlug({
				slug:$stateParams.productSlug
			});
		};
	}
	]);