'use strict';

angular.module('shop').directive('cartNotification', ['$http',
	function($http) {
		return {
			template: '<span class="badge">{{quantity}}</span>',
			restrict: 'EA',
			scope: true,
			link: function (scope, element, attrs) {
				scope.quantity = 0;

				$http.get('/api/carts/quantity').then(function(res){
					scope.quantity = res.data.quantity;
				}, function(err){

				});

				scope.$root.$on('cartChange', function(){
					$http.get('/api/carts/quantity').then(function(res){
						scope.quantity = res.data.quantity;
					}, function(err){

					});
				});
			}
		};
	}
	]);