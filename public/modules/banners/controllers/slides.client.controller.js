'use strict';

angular.module('banners').controller('SlidesController', ['$scope','$http',
	function($scope,$http) {
		$scope.myInterval = 5000;
		var slides = $scope.slides = [];


		$http.get('/api/banners').then(function(res){
			for (var i=0; i<res.data.length; i++) {
				$scope.addSlide(res.data[i].image.url);
			}		
		},function(err){
			console.log(err.data);
		});



		$scope.addSlide = function(imageUrl) {
			slides.push({
				image: imageUrl
			});
		};
		
		
	}
	]);