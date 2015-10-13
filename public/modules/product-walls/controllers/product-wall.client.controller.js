'use strict';

angular.module('product-walls').controller('ProductWallController', ['$scope','$http',
	function($scope,$http) {
		$scope.categories = [];
		
		$scope.displayWalls = function(){
			console.log('DisPlay');
			$http.get('/api/shop/wall').then(function(res){
				$scope.categories=res.data;
			},function(err){
				console.log(err.data);
			});
			
		};
	}
	]);