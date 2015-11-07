'use strict';

angular.module('orders').directive('paymentForm', [
	function() {
		return {
			templateUrl: '/modules/orders/directives/templates/payment-form.html',
			restrict: 'E',
			scope: {
				payment:'='
			},
			controller: function($scope){
				$scope.$watch('payment', function(newValue, oldValue){
					$scope.$emit('paymentChange', newValue);
				});
			}
		};
	}
]);