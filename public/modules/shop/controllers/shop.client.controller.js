'use strict';

angular.module('shop').controller('ShopCtrl', ['$scope','$http','$location','$stateParams','Products','Categories',
	function($scope,$http,$location,$stateParams,Products,Categories) {

		$scope.pagination = {
			current: 1,
			perPage: 20,
			totalQty: 0
		};
		
		$scope.selectedQuantity = 1;

		$scope.categoryWithProducts = {};

		$scope.viewProductCategory = function(){
			if(!$stateParams.categorySlug) $location.path('/');

			$http.get('/api/shop/catalog/'+$stateParams.categorySlug)
			.then(function(response) {
				$scope.categoryWithProducts = response.data;
				$scope.getTotalQuantity();
			}, function(errorResponse) {
				$location.path('/');
			});
		};

		
		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};

		$scope.findProduct = function(){
			Products.getBySlug({
				slug:$stateParams.productSlug
			})
			.$promise
			.then(function(res) {
				$scope.product = res;
			}, function(err){
				if(err) {
					$location.path('/');
				}
			});

		};

		$scope.getTotalQuantity = function(){
			Products
			.getQty({ byCategory: $scope.categoryWithProducts._id, priceNotZero: 1 })
			.$promise
			.then(function(res) {
				console.log(res);
			}, function(err) {

			});
		};
	}
	]);