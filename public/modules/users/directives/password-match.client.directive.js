'use strict';

angular.module('users').directive('passwordMatch', [
	function() {
		return {
			scope:true,
			require:'ngModel',
			restrict: 'A',
			link: function (scope, element, attrs,ctrl) {
				var checkMatch = function(){
					var e1 = scope.$eval(attrs.ngModel);
					var e2 =  scope.$eval(attrs.passwordMatch);

					return e1 == e2;
				};

				scope.$watch(checkMatch,function(n){
					ctrl.$setValidity('passwordMatch',n);
				});
				
			}
		};
	}
]);