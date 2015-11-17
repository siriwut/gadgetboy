'use strict';

angular
.module('orders-manager')
.controller('OrdersManagerCtrl', ['$scope', '$state', 'Orders', 'orderStatus', function($scope, $state, Orders, orderStatus) {
	var vm = this;
	vm.orders = [];
	vm.status = $state.params.status || '';
	vm.statusTitle = orderStatus.getTitle(vm.status);
	vm.list = list;

	function list() {
		return Orders
		.query({ status: vm.status })
		.$promise
		.then(function(res){
			vm.orders = res;
		}, function(err) {

		});
	}
}
]);