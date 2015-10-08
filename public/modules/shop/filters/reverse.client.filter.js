'use strict';

angular.module('shop').filter('reverse', [
	function() {
		return function(input) {
			return input.slice().reverse();
		};
	}
]);