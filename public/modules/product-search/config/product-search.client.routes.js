'use strict';

//Setting up route
angular.module('product-search').config(['$stateProvider',
	function($stateProvider) {
		// Product search state routing
		$stateProvider.
		state('searchResult', {
			url: '/search?q',
			templateUrl: 'modules/product-search/views/product-search-result.client.view.html'
		});
	}
]);