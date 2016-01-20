'use strict';

angular.module('product-walls').controller('ProductWallController', ['$scope','$http',
	function($scope,$http) {
		$scope.categories = [];
		
		$scope.displayWalls = function(){
			$http.get('/api/shop/wall').then(function(res){	
				$scope.categories = _.filter(res.data, function(obj) {
					return obj.products.length >= 4 ;
				});
			},function(err){
				console.log(err.data);
			});
			
		};
	}
	]);