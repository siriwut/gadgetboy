'use strict';

angular
.module('customer-panel')
.controller('CustomerOrdersCtrl', ['$scope', '$state', '$stateParams','Orders','Upload',
	function($scope, $state, $stateParams, Orders, Upload) {
		var co = this;

		co.orders = [];
		co.order = {};
		co.paidEvidence = {};

		co.listByUser = listByUser;
		co.findOne = findOne;
		co.confirmPayment = confirmPayment;
		co.upload = upload;

		co.dateTimePicker = {
			format: 'dd/MM/yyyy',
			status: {
				opened: false
			},
			today: dateToday,
			open: openDatePopup
		};


		co.dateTimePicker.today();
		

		function listByUser() {
			Orders.listByUser().$promise.then(function(res) {
				co.orders = res;
			}, function(err) {

			});
		}

		function findOne() {
			Orders
			.get({ orderId: $stateParams.orderId })
			.$promise
			.then(function(res) {
				co.order = res;
			}, function(err){
				$state.go('customerPanel.listOrders');
			});
		} 

		function confirmPayment() {
			co.upload(co.paidEvidence.photo, { 
				cost:co.paidEvidence.cost,
				message: co.paidEvidence.message,
				paidTime: co.paidEvidence.paidTime
			});
		}

		function upload(file, data) {
			Upload.upload({
				url: '/api/orders/confirm',
				file: file,
				data: data 
			}).then(function(res) {
				console.log(res);
			}, function(err) {
				console.log(err);
			});
		}


		function dateToday() {
			co.paidEvidence.paidTime = new Date();
		}

		function openDatePopup($event) {
			co.dateTimePicker.status.opened = true;
		}
	}
	]);