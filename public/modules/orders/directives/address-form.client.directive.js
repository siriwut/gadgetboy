'use strict';

angular.module('orders').directive('addressForm', [
	function() {
		return {
			templateUrl: '/modules/orders/directives/templates/address-form.html',
			restrict: 'E',
			scope: {
				address:'=',
				provinces:'='
			}
		};
	}
]);