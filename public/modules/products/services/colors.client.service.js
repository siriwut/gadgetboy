'use strict';

angular.module('products').factory('Colors', [
	function() {
		return {
			'red':'#F00',
			'green':'#0F0',
			'blue':'#00F',
			'cyan':'#0FF',
			'magenta':'#F0F',
			'yellow':'#FF0',
			'black':'#000',
			'white':'#FFF'
		};
	}
	]);