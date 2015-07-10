'use strict';

//Setting up route
angular.module('banners').config(['$stateProvider',
	function($stateProvider) {
		// Banners state routing
		$stateProvider.
		state('banners', {
			url: '/banners',
			templateUrl: 'modules/banners/views/main-banner.client.view.html'
		});
	}
]);