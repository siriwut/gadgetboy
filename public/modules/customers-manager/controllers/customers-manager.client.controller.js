'use strict';

angular
.module('customers-manager')
.controller('CustomersManagerCtrl', ['$scope', 'Customers', function ($scope, Customers) {
	var cm = this;
	cm.customers = [];
	cm.list = list;
	cm.remove = remove;
	
	function list() {
		return Customers.query().$promise.then(function(customers) {
			cm.customers = customers;
			return cm.customers;
		}, function(err) {
			//console.log(err);
		});
	}

	function remove(customer) {
		return customer.$remove(function(){	
			var index = _.findIndex(cm.customers, '_id', customer._id);
			return cm.customers.splice(index, 1);
		});
	}
}]);
