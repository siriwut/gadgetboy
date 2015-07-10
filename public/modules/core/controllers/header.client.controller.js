'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http','$location','$window', 'Authentication', 'Menus',
	function($scope,$http,$location,$window, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

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
	}
]);