'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http','$location','$window', 'Authentication', 'Menus','Categories','CartModal',
	function($scope,$http,$location,$window, Authentication, Menus,Categories,CartModal) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		
		$scope.checkRole = function(){
			if(!$scope.authentication) return;

			if($scope.authentication.user)
				return $scope.authentication.user.roles.indexOf('admin')===1;
		};

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

		$scope.openCart = function(){
			CartModal.open();
		};
	}
	]);