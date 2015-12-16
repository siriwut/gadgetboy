'use strict';

angular.module('customer-panel').directive('customerPanelSidebar', [
	function() {
		return {
			templateUrl: 'modules/customer-panel/directives/templates/customer-panel-sidebar.html',
			restrict: 'E',
			controller: ['$scope', function($scope) {
				
			}]
		};
	}
]);