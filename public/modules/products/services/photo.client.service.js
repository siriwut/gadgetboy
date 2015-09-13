'use strict';

angular.module('products').factory('Photos',  ['$resource',
	function($resource) {
		return $resource('/api/photos/:photoId',{
			photoId:'@_id'
		},{
			update:{
				method:'PUT'
			}
		});
	}
	
	]);