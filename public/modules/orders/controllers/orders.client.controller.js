'use strict';

// Orders controller
angular.module('orders').controller('OrdersCtrl', ['$scope', '$state', '$http', '$stateParams', '$location', '$timeout', 'Authentication', 'ProvinceList',
	function($scope, $state, $http, $stateParams, $location, $timeout, Authentication, ProvinceList) {
		
		$scope.authentication = Authentication;
		$scope.stateName = $state.current.name;
		$scope.products = [];
		$scope.totalPrice = 0;
		$scope.netTotalPrice = 0;
		$scope.shippingCost = 0;
		$scope.provinces = ProvinceList;
		$scope.address = {};
		$scope.address.province = ProvinceList[0];
		$scope.payment = 'bkt';
		$scope.paymentExtraCost = 0;
		

		$scope.order = function() {	
			if(!$scope.products.length) return;

			var data = {
				address: this.address,
				order: {
					totalPrice: $scope.totalPrice,
					payment: {
						type: this.payment,
						cost : $scope.paymentExtraCost
					},
					shipping: {
						type: $scope.shippingCost > 0? 'cost': 'free',
						cost: $scope.shippingCost
					},
					status: 'new'
				}
			};

			/*$http.post('/api/orders', data).then(function(res){
				$state.go('checkout.complete', null, {reload:true});
			}, function(err){

			});*/
		};

		$scope.initAddress = function(){
			$http.get('/api/customers/'+ $scope.authentication.user._id).then(function(res){
				$scope.address = res.data.addresses[0];
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


	}
	]);