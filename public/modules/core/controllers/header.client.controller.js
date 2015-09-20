'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http','$location','$window', 'Authentication', 'Menus','Categories',
	function($scope,$http,$location,$window, Authentication, Menus,Categories) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		//console.log($scope.authentication.user);

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.signout = function(){
			$http.get('/api/auth/signout').success(function(response){
				localStorage.removeItem('JWT');
				$scope.authentication = undefined;
				$window.location.href = '/';
			});
		};

		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};
	}
]);