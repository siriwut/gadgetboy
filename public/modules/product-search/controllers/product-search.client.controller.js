'use strict';

angular.module('product-search').controller('ProductSearchController', ['$scope','$location','$window','$http','$state','$stateParams','Products','Categories',
	function($scope,$location,$window,$http,$state,$stateParams,Products,Categories) {

		$scope.search = function(){
			$state.go('searchResult',{q:$scope.query});
		};

		$scope.searchResult = function(){

			if(!$stateParams.q){
				$location.url($location.path());
				$location.path('/');
			}

			$scope.query = $stateParams.q;
			$scope.products = [];

			Products.search({q:$scope.query},function(result){
				$scope.products = result;
			},function(err){
				console.log(err);
			});
		};


		$scope.initCategories = function(){
			$scope.categories = Categories.query();

		};

	}]);