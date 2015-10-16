'use strict';

angular.module('product-search').controller('ProductSearchController', ['$scope','$location','$window','$http','$state','$stateParams','Products','Categories',
	function($scope,$location,$window,$http,$state,$stateParams,Products,Categories) {

		$scope.search = function(){
			$state.go('searchResult',{q:$scope.query});
		};

		$scope.searchResult = function(){
			$scope.products = [];

			Products.search({q:$stateParams.q},function(result){
				$scope.products = result;
				console.log($scope.products);
			},function(err){
				console.log(err);
			});
		};


		$scope.initCategories = function(){
			$scope.categories = Categories.query();

		};

	}]);