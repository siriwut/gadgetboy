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
				$location.path('/');
			});

			//$scope.products = Products.query({categoryId:$stateParams.categoryId});	
		};

		
		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};

		$scope.findProduct = function(){
			Products.getBySlug({
				slug:$stateParams.productSlug
			}).$promise.then(function(res) {
				$scope.product = res;
			}, function(err){
				if(err) {
					$location.path('/');
				}
			});

		};
	}
	]);