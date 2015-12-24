'use strict';

angular.module('orders-manager').filter('parseToCustomerPaymentMethod', [
	function() {
		return function(input) {

			var message = '';
			
			switch(input) {
				case 'bkt': 
				message = 'โอนเงินผ่านธนาคาร';
				break;
				case 'cod':
				message = 'ชำระเงินปลายทาง';
				break;
				default: 
				message = '';
			}

			return message;
		};
	}
	]);