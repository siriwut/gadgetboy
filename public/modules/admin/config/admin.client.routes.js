'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('adminPanel', {
			url: '/admin-panel',
			templateUrl: 'modules/admin/views/admin-panel.client.view.html'
		});
	}	
	]);
