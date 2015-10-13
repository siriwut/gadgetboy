'use strict';

//Setting up route
angular.module('banners').config(['$stateProvider',
	function($stateProvider) {
		// Banners state routing
		$stateProvider.
		state('adminPanel.banners', {
			url: '/banners',
			templateUrl: 'modules/banners/views/banner.client.view.html'
		});
	}
]);