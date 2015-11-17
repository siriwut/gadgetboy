'use strict';

angular.module('orders-manager').directive('orderStatusTitleColor', [
	function() {
		return {
			restrict: 'A',
			scope: {
				status:'='
			},
			link: function(scope, element, attrs) {
				
			}
		};
	}
]);