'use strict';

angular.module('admin').controller('AdminPanelController', ['$scope','$location','Authentication',
	function($scope,$location,Authentication) {
		$scope.authentication = Authentication;
		
		if ($scope.authentication.user){
			if($scope.authentication.user.roles[0]!="admin") $location.path('/');
		}else{
			$location.path('/');
		}		

	}
	]);