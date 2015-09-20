'use strict';

angular.module('categories').directive('colorpicker', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Colorpicker directive logic
				// ...

				element.text('this is the colorpicker directive');
			}
		};
	}
]);