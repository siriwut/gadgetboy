'use strict';

// Orders controller
angular
	.module('orders')
	.controller('OrdersCtrl', 
	['$scope', '$window', '$state', '$http', '$stateParams', '$location', '$timeout', 'Authentication', 'ProvinceList', 'CartCalculator', 'Flash', 'orderService',
	function($scope, $window, $state, $http, $stateParams, $location, $timeout, Authentication, ProvinceList, CartCalculator, Flash, orderService) {
		
		$scope.authentication = Authentication;
		$scope.stateName = $state.current.name;
		$scope.products = [];
		$scope.totalPrice = 0;
		$scope.netTotalPrice = 0;
		$scope.shippingCost = 0;
		$scope.provinces = ProvinceList;
		$scope.address = {};
		$scope.address.province = ProvinceList[1];
		$scope.payment = 'bkt';
		$scope.paymentExtraCost = 0;
		$scope.hasAddressAlready = false;
		
		$scope.addOrder = function() {	
			if(!$scope.products.length) return;

			var data = {
				order: {
					totalPrice: $scope.totalPrice,
					netTotalPrice: $scope.netTotalPrice,
					payment: {
						type: this.payment,
						cost : $scope.paymentExtraCost
					},
					shipping: {
						type: $scope.shippingCost > 0? 'cost': 'free',
						cost: $scope.shippingCost
					},
					status: 'new',
					address: this.address
				}
			};


			$http.post('/api/orders', data).then(function(res) {
				$window.location.assign('/checkout/step/complete/' + res.data._id);
			}, function(err){
				Flash.create('danger', 'การสั่งซื้อผิดพลาดกรุณาลองใหม่ค่ะ');
			});
		};


		$scope.complete = function() {
			$http.get('/api/orders/' + $state.params.orderId)
			.then(function(res){
				$scope.order = res.data;
				$scope.totalQuantity = CartCalculator.totalQuantity($scope.order.orders.products);
			}, function(err){
					$location.path('/');
			});
		};

		$scope.initAddress = function(){
			$http.get('/api/customers/'+ $scope.authentication.user._id).then(function(res){
				if(res.data.addresses[0]){
					$scope.address = res.data.addresses[0];
					$scope.hasAddressAlready = true;
				}
			}, function (err){

			});
		};

		$scope.authenticate = function() {
			if(!($scope.authentication && $scope.authentication.user)){
				$location.path('/');
			}
		};

		$scope.hasCartItems = function() {
			$http.get('/api/carts/quantity').then(function(res){
				if(res.data.quantity <= 0){
					$location.path('/');
				}
			}, function(err){
				$location.path('/');
			});
		};

		$scope.$on('paymentChange', function(e, value){
			$scope.paymentExtraCost = value === 'cod'? 100: 0;
			$scope.$broadcast('hasExtraCost', $scope.paymentExtraCost);			
		});

		$scope.$on('cartChange', function(e){
			$timeout(function(){
				$scope.products = e.targetScope.productsInCart;
				$scope.totalPrice = e.targetScope.totalPrice;
				$scope.shippingCost = e.targetScope.shippingCost;
				$scope.netTotalPrice = e.targetScope.netTotalPrice;
			}, 1000);
		});

		$scope.$on('netTotalPriceChange', function(e, value){
			$scope.netTotalPrice = value;
		});
	}
	]);