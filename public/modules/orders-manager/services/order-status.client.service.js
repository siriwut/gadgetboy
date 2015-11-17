'use strict';

angular
.module('orders-manager')
.factory('orderStatus', [
	function() {

		var title = { 
			new: 'ใหม่', 
			confirmed: 'ยื่นหลักฐานชำระแล้ว', 
			paid: 'ชำระแล้ว', 
			delivered: 'จัดส่งแล้ว', 
			completed: 'เสร็จสมบูรณ์', 
			overtime: 'เกินกำหนดชำระ', 
			canceled: 'ยกเลิกแล้ว' 
		};

		var service = {
			getTitle: getTitle,
			setTitle: setTitle
		};

		return service;

		function getTitle(key) {
			return title[key] || '';
		}

		function setTitle(key, value) {
			title[key] = value;
		}
	}
	]);