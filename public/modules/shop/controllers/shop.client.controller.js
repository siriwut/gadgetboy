'use strict';

angular.module('shop').controller('ShopCtrl', ['$scope','$http','$location','$stateParams','Products','Categories',
	function($scope,$http,$location,$stateParams,Products,Categories) {
		
		$scope.selectedQuantity = 1;

		$scope.viewProductCategory = function(){
			if(!$stateParams.categorySlug) $location.path('/');

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
			if(!$stateParams.productSlug) $location.path('/');

			$scope.product = Products.getBySlug({
				slug:$stateParams.productSlug
			});
		};
	}
	]);