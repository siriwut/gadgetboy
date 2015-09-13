'use strict';

angular.module('admin')
.controller('adminSidebarController',['$scope','$state',function($scope,$state){
	$scope.collapseVar = 0;

	$scope.check = function(itemNum){
		$scope.collapseVar = (itemNum!==$scope.collapseVar)? itemNum : 0;
	};

	

	switch($state.current.name){
		case 'adminPanel.createProduct':$scope.check(2);
		break;
		case 'adminPanel.editProduct':$scope.check(2);
		break;
		case 'adminPanel.listProducts':$scope.check(2);
		break;
		case 'adminPanel.listCategories':$scope.check(3);
		break;
		case 'adminPanel.createCategory':$scope.check(3);
		break;
	}

}])
.directive('adminSidebar', [
	function() {
		return {
			templateUrl: 'modules/admin/directives/admin-sidebar.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			},
		};
	}]);