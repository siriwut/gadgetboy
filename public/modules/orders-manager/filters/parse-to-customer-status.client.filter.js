'use strict';

angular.module('orders-manager').filter('parseToCustomerStatus', [
	function() {
		return function(input) {

			var message = '';
			
			switch(input) {
				case 'new': 
				message = 'รอแจ้งการชำระเงิน';
				break;
				case 'confirmed':
				message = 'กำลังดำเนินการตรวจสอบ';
				break;
				case 'paid':
				message = 'กำลังเตรียมจัดส่ง';
				break;
				case 'delivered':
				message = 'จัดส่งเรียบร้อยแล้ว';
				break;
				case 'completed':
				message = 'คำสั่งซื้อเสร็จสมบูรณ์';
				break;
				case 'overtime':
				message = 'เกินกำหนดชำระเงิน';
				break;
				case 'canceled':
				message = 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว';
				break;
				default: 
				message = '';
			}

			return message;
		};
	}
	]);