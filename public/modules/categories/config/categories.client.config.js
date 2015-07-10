'use strict';

// Categories module config
angular.module('categories').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories');
	}
]);