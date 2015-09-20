'use strict';

angular.module('products').factory('ProductsByCategory', ['$resource',
	function($resource) {
		return $resource('/api/products/category/:categoryId',{
			categoryId:'@_id'
		},{
			update:{
				method:'PUT'
			}
		});
	}
	
	]);