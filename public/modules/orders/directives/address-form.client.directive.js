'use strict';

angular.module('orders').directive('addressForm', [
	function() {
		return {
			templateUrl: '/modules/orders/directives/templates/address-form.html',
			restrict: 'E',
			scope: {
				address:'=',
				provinces:'=',
				hasAddressAlready: '='
			},
			controller: function($scope){

				$scope.isOtherAddress = false;

				var addressTemp = {};

				$scope.useOtherAddress = function(event){		
					if(this.isOtherAddress){
						addressTemp = $scope.address;
						$scope.address = {province: $scope.provinces[1]};
					} else {
						$scope.address = addressTemp;
					}
				};
			}
		};
	}
	]);