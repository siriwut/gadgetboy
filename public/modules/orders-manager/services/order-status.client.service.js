'use strict';

angular
.module('orders-manager')
.factory('orderStatus', [
	function() {

		var statuses = [
		'new', 
		'confirmed', 
		'paid', 
		'delivered', 
		'completed', 
		'overtime', 
		'canceled' 
		];

		var titles = { 
			new: 'ใหม่', 
			confirmed: 'ยื่นหลักฐานชำระแล้ว', 
			paid: 'ชำระแล้ว', 
			delivered: 'จัดส่งแล้ว', 
			completed: 'เสร็จสมบูรณ์', 
			overtime: 'เกินกำหนดชำระ', 
			canceled: 'ยกเลิกแล้ว' 
		};

		var orderStatus = {
			statuses: statuses,
			getTitle: getTitle,
			setTitle: setTitle
		};

		return orderStatus;

		function getTitle(key) {
			return titles[key] || '';
		}

		function setTitle(key, value) {
			titles[key] = value;
		}
	}
	]);