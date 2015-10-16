'use strict';

angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('/api/products/:productId/:controller',{
			productId:'@_id'
		},{
			update:{
				method:'PUT'
			},
			getBySlug: {
				method: 'GET',
				params: {
					controller: 'read-slug'
				}
			},
			search: {
				url:'/api/products/search',
				method:'GET',
				isArray:true
			}
		});
	}
	
	]);