'use strict';

angular
.module('customer-panel')
.controller('AddressesCtrl', function($scope, ProvinceList, Customers, Flash) {
	var addr = this;
	
	addr.addresses = [];
	addr.address = {};
	addr.provinces = ProvinceList;
	addr.customer = {};

	addr.findOneAddress = findOneAddress;
	addr.listAddresses = listAddresses;
	addr.editAddress = editAddress;

	function listAddresses() {
		Customers
		.getByUser()
		.$promise
		.then(function(res) {
			addr.addresses = res.addresses;
		}, function(err) {

		});
	}

	function findOneAddress() {
		Customers
		.getByUser()
		.$promise
		.then(function(res) {
			addr.customer = res;
			addr.address = res.addresses[0];
		}, function(err) {

		});
	}

	function editAddress() {
		addr.customer.addresses[0] = addr.address;

		addr.customer.$update(function(res) {
			addr.address = res.addresses[0];
			Flash.create('success', 'บันทึกเรียบร้อยแล้วค่ะ');
		}, function(err) {
			Flash.create('danger', 'การแก้ไขผิดพลาด กรุณาลองใหม่ค่ะ');
		});
	}
});