'use strict';

angular
.module('orders-manager')
.controller('OrdersManagerCtrl', 
	['$scope', '$state', 'paginationConfig', 'Orders', 'orderStatus', 'orderManager', 'Flash', 
	function($scope, $state, paginationConfig, Orders, orderStatus, orderManager, Flash) {

		var om = this;
		om.order = {};
		om.orders = [];
		om.statuses = {};
		om.status = '';
		om.statusTitle = '';
		om.pagination = {};

		om.view = view;
		om.initListPage = initListPage;
		om.listPageChanged = listPageChanged;
		om.update = update;
		om.remove = remove;

		function initListPage() {
			om.status = $state.params.status;
			om.statusTitle = orderStatus.getTitle(om.status);
			om.pagination = {
				totalItems: 0,
				currentPage: 1
			};
			paginationConfig.itemsPerPage = 10;

			list();
			getQuantity();
		}

		function list() {
			Orders.query({ 
				status: om.status, 
				itemsPerPage: paginationConfig.itemsPerPage, 
				currentPage: om.pagination.currentPage
			}).$promise.then(function(res){
				om.orders = res;
			}, function(err) {

			});
		}

		function view() {
			om.statuses = orderStatus.statuses;
			om.status = $state.params.status;
			om.statusTitle = orderStatus.getTitle(om.status);

			Orders.get({ orderId: $state.params.orderId }).$promise.then(function(res) {
				om.order = res;
				orderManager.init(om.order.orders);
				om.order.orders.totalProductsQuantity = orderManager.getTotalProductsQty() || 0;

			}, function(err) {
				if(err) {
					$state.go('adminPanel');
				}
			});
		}

		function getQuantity() {		
			Orders.count({ status: om.status }).$promise.then(function(res) {
				om.pagination.totalItems = res.count;
			}, function(err) {

			});
		}

		function listPageChanged() {
			list();
		}


		function update() {
			var order = om.order;

			order.$update().then(function(res) {
				$state.go('adminPanel.viewOrder', {status: res.orders.status, orderId: res.orders._id });
			}, function(err) {

			});		
		}

		function remove(order) {
			Orders
			.remove({ customerId: order._id, orderId: order.orders._id  })
			.$promise.then(function(res) {
				var index = _.findIndex(om.orders, '_id', order._id);
				var message = 'ลบรายการคำสั่งซื้อ '+ order.orders.code + ' เรียบร้อยแล้วค่ะ';

				om.orders.splice(index, 1);
				Flash.create('success', message);

			}, function(err) {
				var message = 'ไม่สามารถลบรายการคำสั่งซื้อ '+ order.orders.code + ' กรุณาลองใหม่ค่ะ';

				if(err) {
					Flash.create('danger', message);
				}
			});
		}
	}
	]);