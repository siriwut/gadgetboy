'use strict';

angular.module('products').filter('productsManagerTitle', [
	function() {
		return function(input) {

			var title = '';

			switch(input) {
				case 'sale':
				title = 'ลดราคา';
				break;
				case 'soleOut':
				title = 'หมดสต็อก';
				break;
				default:
				title = 'ทั้งหมด';
			}

			return title;
		};
	}
]);