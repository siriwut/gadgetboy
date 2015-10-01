'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location','$window', 'Authentication','Flash',
	function($scope, $http, $location,$window, Authentication,Flash) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		

		$scope.signup = function() {
			$scope.credentials.username = $scope.credentials.email;

			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;

				Flash.dismiss();
				Flash.create('danger',$scope.error);
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
				Flash.dismiss();
				Flash.create('danger',$scope.error);
			});
		};

		$scope.signupWithFacebook = function(){
			$window.location.assign('/api/auth/facebook');
		};

		$scope.signinWithFacebook = function(){
			$window.location.assign('/api/auth/facebook');
		};
	}
	]);