'use strict';

angular.module('banners').controller('BannersController', ['$scope',
	function($scope) {
		$scope.myInterval = 5000;
		var slides = $scope.slides = [];
		$scope.addSlide = function() {
			var newWidth = 1200 + slides.length + 1;
			slides.push({
				image: 'http://placekitten.com/' + newWidth + '/500',
				text: ['More','Extra','Lots of','Surplus'][slides.length % 2] + ' ' +
				['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 2]
			});
		};
		for (var i=0; i<2; i++) {
			$scope.addSlide();
		}
	}
	]);