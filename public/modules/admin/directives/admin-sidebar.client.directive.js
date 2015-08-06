'use strict';

angular.module('admin').directive('adminSidebar', [
	function() {
		return {
			templateUrl: 'modules/admin/directives/admin-sidebar.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			},
			controller: function($scope){
				$scope.collapseVar = 0;

				$scope.check = function(itemNum){
					$scope.collapseVar = (itemNum!==$scope.collapseVar)? itemNum : 0;
				};
			}
		};
	}
	]);