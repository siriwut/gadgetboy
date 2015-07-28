'use strict';

angular.module('product-search').controller('ProductSearchController', ['$scope','$location','$window',
	function($scope,$location,$window) {
		//$scope.isVisible = ($location.path()==='/')? true : false;
		console.log($window.location.pathname);
	}
]);