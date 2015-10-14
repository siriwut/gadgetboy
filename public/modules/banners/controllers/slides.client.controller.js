'use strict';

angular.module('banners').controller('SlidesController', ['$scope','$http',
	function($scope,$http) {
		$scope.myInterval = 5000;
		var slides = $scope.slides = [];


		$http.get('/api/banners').then(function(res){
			for (var i=0; i<res.data.length; i++) {
				$scope.addSlide({
					image:res.data[i].image.url,
					productUrl:res.data[i].productUrl,
					text:res.data[i].text
				});
			}		
		},function(err){
			console.log(err.data);
		});



		$scope.addSlide = function(image) {
			slides.push(image);
		};
		
		
	}
	]);