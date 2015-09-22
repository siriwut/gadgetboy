'use strict';

angular.module('shop').controller('ProductCategoriesCtrl', ['$scope','$http','$stateParams','Products','Categories',
	function($scope,$http,$stateParams,Products,Categories) {
		$scope.viewProductCategory = function(){

			$http.get('/api/shop/catalog/'+$stateParams.categoryId)
			.then(function(response) {
				$scope.products = response.data;
			}, function(errorResponse) {
				console.log('Error');
			});

			//$scope.products = Products.query({categoryId:$stateParams.categoryId});	
		};

		$scope.initCategory = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};

		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};
	}
	]);