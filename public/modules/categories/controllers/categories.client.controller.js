'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$location','$state','$stateParams', 'Authentication', 'Categories','Products','ProductsByCategory',
	function($scope, $location,$state,$stateParams, Authentication, Categories,Products,ProductsByCategory) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories (this.category);

			// Redirect after save
			category.$save(function(response) {
				
				$state.go('adminPanel.editCategory',{categoryId:response._id});

				// Clear form fields
				$scope.category = null;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 

				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};

		$scope.findProductsByCategory = function(){
			$scope.products = Products.query({categoryId:$stateParams.categoryId});				
			
		};
	}
	]);