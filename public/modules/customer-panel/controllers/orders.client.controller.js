'use strict';

angular
.module('customer-panel')
.controller('CustomerOrdersCtrl', 
	function($scope, $state, $stateParams, $confirm, Orders, Upload, Flash) {
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
			var confirmData = {
				title: 'ยืนยันแจ้งการชำระเงิน',
				text:'คุณต้องการยืนยันแจ้งการชำระเงิน หรือไม่',
				ok: 'ยืนยัน', 
				cancel: 'ยกเลิก'
			};

			var confirmTemplate = '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
			'<div class="modal-body">{{data.text}}</div>' +
			'<div class="modal-footer">' +
			'<button class="btn btn-success" ng-click="ok()">{{data.ok}}</button>' +
			'<button class="btn btn-danger" ng-click="cancel()">{{data.cancel}}</button>' +
			'</div>';

			$confirm(confirmData, { template: confirmTemplate }).then(function() {
				co.upload(co.paidEvidence.photo, {
					orderId: $stateParams.orderId,
					cost:co.paidEvidence.cost,
					message: co.paidEvidence.message || '',
					paidTime: co.paidEvidence.paidTime
				});
			});			
		}

		function upload(file, data) {
			Upload.upload({
				url: '/api/orders/confirm',
				method: 'put',
				file: file,
				data: data 
			}).then(function(res) {
				$state.go('customerPanel.listOrders');
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
	});