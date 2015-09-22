'use strict';

angular.module('products').directive('pagination', [
	function() {
		return {
			templateUrl: 'modules/products/directives/pagination.html',
			restrict: 'E',
			transclude:true,
			replace:true,
			link: function postLink (scope, element, attrs) {
				console.log('Directive!!!!!!');
			}
		};
	}
]);