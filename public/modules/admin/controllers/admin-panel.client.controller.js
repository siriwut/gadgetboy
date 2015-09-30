'use strict';

angular.module('admin').controller('AdminPanelController', ['$scope','$location','Authentication',
	function($scope,$location,Authentication) {
		$scope.authentication = Authentication;
		

		if ($scope.authentication.user){
			if($scope.authentication.user.roles.indexOf('admin') === -1) $location.path('/');
				
		}else{
			$location.path('/');
		}

	}
	]);