'use strict';

angular.module('admin')
.controller('adminSidebarController',['$scope','$state', 'Orders', 'ordersCounter',function($scope, $state, Orders, ordersCounter){
	$scope.collapseVar = 0;
	$scope.ordersQty = {};

	$scope.check = function(itemNum){
		$scope.collapseVar = (itemNum!==$scope.collapseVar)? itemNum : 0;
	};

	collapse();
	countOrders();
	
	function collapse() {
		switch($state.current.name){
			case 'adminPanel.listOrders':$scope.check(1);
			break;
			case 'adminPanel.createProduct':$scope.check(2);
			break;
			case 'adminPanel.editProduct':$scope.check(2);
			break;
			case 'adminPanel.listProducts':$scope.check(2);
			break;
			case 'adminPanel.listCategories':$scope.check(3);
			break;
			case 'adminPanel.createCategory':$scope.check(3);
			break;
			case 'adminPanel.editCategory':$scope.check(3);
			break;
			case 'adminPanel.listCustomers':$scope.check(4);
			break;
			case 'adminPanel.banners':$scope.check(5);
			break;
		}
	}

	function countOrders() {
		ordersCounter.count('new', function(n) {
			$scope.ordersQty.new = n;
		});

		ordersCounter.count('confirmed', function(n) {
			$scope.ordersQty.confirmed = n;
		});
	}

}])
.directive('adminSidebar', [
	function() {
		return {
			templateUrl: 'modules/admin/directives/admin-sidebar.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			},
		};
	}]);