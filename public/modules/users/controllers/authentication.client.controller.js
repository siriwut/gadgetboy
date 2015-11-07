'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$window', '$state', 'Authentication','Flash',
	function($scope, $http, $location, $window, $state, Authentication, Flash) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		
		$scope.signup = function() {
			var pageQuery = $state.current.name === 'checkout.signin'? '?page=checkout': '';

			$http.post('/api/auth/signup' + pageQuery, $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				if($location.search().page === 'checkout'){
					return $window.location.assign('/checkout/step/shippingandpayment');	
				}

				$window.location.assign('/');

			}).error(function(response) {
				$scope.error = response.message;

				Flash.dismiss();
				Flash.create('danger',$scope.error);
			});
		};

		$scope.signin = function() {
			var pageQuery = $state.current.name === 'checkout.signin'? '?page=checkout': '';

			$http.post('/api/auth/signin' + pageQuery, $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				if($state.current.name === 'checkout.signin'){
					return $state.go('checkout.shippingandpayment');
				}
				
				$window.location.assign('/');

			}).error(function(response) {
				$scope.error = response.message;
				Flash.dismiss();
				Flash.create('danger',$scope.error);
			});
		};

		$scope.signupWithFacebook = function(){
			$window.location.assign('/api/auth/facebook/' + (($state.current.name === 'checkout.signin') || ($location.search().page === 'checkout')? 'checkout': 'index'));
		};
	}
	]);