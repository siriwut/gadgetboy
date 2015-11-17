'use strict';

angular
.module('customers-manager')
.controller('CustomersManagerCtrl', ['$scope', 'Customers', function ($scope, Customers) {
	
	var vm = this;

	vm.customers = [];
	vm.list = list;
	vm.remove = remove;
	
	function list() {
		return Customers.query().$promise.then(function(customers) {
			vm.customers = customers;
			return vm.customers;
		}, function(err) {
			//console.log(err);
		});
	}

	function remove(customer) {
		return customer.$remove(function(){	
			var index = _.findIndex(vm.customers, '_id', customer._id);
			return vm.customers.splice(index, 1);
		});
	}
}]);
