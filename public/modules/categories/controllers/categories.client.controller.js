'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$location','$state','$stateParams','$anchorScroll', 'Authentication', 'Categories','Products','ProductsByCategory','Flash','filterFilter',
	function($scope, $location,$state,$stateParams,$anchorScroll, Authentication, Categories,Products,ProductsByCategory,Flash,filterFilter) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			
			// Create new Category object
			var category = new Categories (this.category);

			// Redirect after save
			category.$save(function(response) {
				var message = 'สร้างหมวดหมู่ <strong>'+response.name+'</strong> เรียบร้อยแล้ว';

				//console.log(response);
				Flash.dismiss();
				Flash.create('success',message);
				// Clear form fields
				$scope.category = null;

				$state.go('adminPanel.editCategory',{categoryId:response._id});
				
			}, function(err) {
				if(err){				
					var message = 'เพิ่มหมวดหมู่ <strong>ล้มเหลว</strong> กรุณาลองใหม่อีกครั้ง';

					$location.hash('top');
					$anchorScroll();

					Flash.dismiss();
					Flash.create('danger',message);
				}
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

				if($scope.categories.length){
					var categories = filterFilter($scope.categories,function(category){
						return category.selected === true;
					});
					
					angular.forEach(categories,function(category,index){
						category.$remove(function(){
							for(var i in $scope.categories){
								if($scope.categories[i] === category){
									$scope.categories.splice(i,1);
								}	
							}
						});

					});
					$scope.categoryChecked = false;

				}
			
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			if(category.parent){
				category.parent =  category.parent._id;
			}

			category.$update(function(response) {
				var message = 'แก้ไขหมวดหมู่ <strong>'+response.name+'</strong> เรียบร้อยแล้ว';

				//console.log(response);
				Flash.dismiss();
				Flash.create('success',message);
			

				$state.go('adminPanel.editCategory',{categoryId:response._id},{reload:true});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query(function(){
				for(var i=0; i<$scope.categories.length;i++){
					$scope.categories[i].selected = false;
				}
			});
		};

		// Find existing Category
		$scope.findOne = function() {
			if(!$stateParams.categoryId) $location.path('/');

			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};

		$scope.findProductsByCategory = function(){
			$scope.products = Products.query({categoryId:$stateParams.categoryId});	
		};


		$scope.action = {
			select:function($event,index){
				var checkbox = $event.target;
				this.updateSelect(checkbox.checked,index);

			},
			selectAll:function($event){
				var checkbox = $event.target;
				this.updateSelectAll(checkbox.checked);
			},
			updateSelect:function(isChecked,index){
				if(isChecked){
					$scope.categories[index].selected = true;
				}else{
					$scope.categories[index].selected = false;
					$scope.categoryChecked = false;
				}
			},
			updateSelectAll:function(isChecked){
				if(isChecked){
					for(var i=0 ; i<$scope.categories.length;i++){
						$scope.categories[i].selected = true;
					}

				}else{
					for(var a=0 ; a<$scope.categories.length;a++){
						$scope.categories[a].selected = false;
					}

				}
			}
		};
	}
	]);