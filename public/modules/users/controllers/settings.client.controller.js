'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication','Flash',
	function($scope, $http, $location, Users, Authentication, Flash) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.username = $scope.user.email;
				var user = new Users($scope.user);

				user.$update(function(response) {
					//$scope.success = true;
					Flash.create('success', 'บันทึกเรียบร้อยแล้ว');
					Authentication.user = response;
				}, function(response) {
					//$scope.error = response.data.message;
					Flash.create('danger', response.data.message);
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			//$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				//$scope.success = true;
				Flash.create('success', 'แก้ไขรหัสผ่านเรียบร้อยแล้ว');
				$scope.passwordDetails = null;
			}).error(function(response) {
				//$scope.error = response.message;
				Flash.create('danger', response.message);
			});
		};
	}
]);