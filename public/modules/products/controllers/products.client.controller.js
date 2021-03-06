'use strict';

angular.module('products').controller('ProductsController', 
	['$scope', '$http', '$location', '$state', '$rootScope', '$stateParams', '$anchorScroll', 'Authentication', 'Products', 'Categories', 'filterFilter', 'Flash', 'EventColors', 'Colors', 'paginationConfig',
	function($scope, $http, $location, $state, $rootScope, $stateParams, $anchorScroll, Authentication, Products, Categories, filterFiler, Flash, EventColors, Colors, paginationConfig) {

		var photoIdList = [];
		var productCheckedList = [];
		
		paginationConfig.itemsPerPage = 20;

		$scope.pagination = {
			current: 1,
			perPage: paginationConfig.itemsPerPage,
			totalQty:  0
		};

		$scope.productFilter = {
			category: {}
		};

		$scope.productBy = $stateParams.productBy;
		$scope.searchQuery = '';


		$scope.create = function(){

			var product = new Products(this.product);

			product.photos = photoIdList;

			if(this.product.category){
				product.category = this.product.category._id;
			}

			product.$save(function(data){
				var message = 'เพิ่มสินค้า '+data.name+' <strong> เรียบร้อยแล้ว</strong>';
				Flash.dismiss();
				Flash.create('success',message);

				$scope.product = null;
				photoIdList = [];
				$scope.$broadcast('onClearForm');

				$state.go('adminPanel.editProduct',{productId:product._id});

			},function(err){		
				if(err){
					var message = 'เพิ่มสินค้า <strong>ล้มเหลว</strong> กรุณาลองใหม่อีกครั้ง';
					Flash.create('danger',message);
					$location.hash('top');
					$anchorScroll();
				}
			});
		};


		$scope.update = function(){
			var product = $scope.product;
			product.photos = photoIdList;

			if($scope.product.category){
				product.category = $scope.product.category._id;
			}
			
			
			product.$update(function(data) {
				

				$scope.product = data;
				$scope.$broadcast('updated');

				var message = 'แก้ไขสินค้า '+data.name+' <strong> เรียบร้อยแล้ว</strong>';

				Flash.dismiss();
				Flash.create('success',message);

				$state.go('adminPanel.editProduct',{productId:data._id},{reload:true});

			}, function(error) {
				$scope.error = error.data.message;
			});
		};

		$scope.list = function(){

			setTableHeader();

			Products
			.query({
				page: $scope.pagination.current,
				perPage: $scope.pagination.perPage,
				productBy: $scope.productBy,
				byCategory: $scope.productFilter.category._id || '',
				search: $scope.searchQuery || ''
			})
			.$promise
			.then(function(res){
				$scope.products = res;
				$scope.getQuantity();
				for(var i=0; i < $scope.products.length;i++){
					$scope.products[i].selected = false;
				}
			},function(err) {

			});
		};



		$scope.remove = function(product){	
			if(product){

				product.$remove(function(){
					for(var i in $scope.products){
						if($scope.products[i] === product){
							$scope.products.splice(i,1);
						}
					}

					$scope.pageChange();
				});

				$scope.productChecked = false;
			}else{
				
				if($scope.products.length){
					var products = filterFiler($scope.products,function(product){
						return product.selected === true;
					});
					

					angular.forEach(products,function(product,index){

						product.$remove(function(){
							for(var i in $scope.products){
								if($scope.products[i] === product){
									$scope.products.splice(i,1);
								}	
							}

							$scope.pageChange();
						});

					});
					$scope.productChecked = false;

				}
			}

		};

		$scope.search = function() {
			$scope.list();
		};


		$scope.productFilter.filterByCategory = function(category) {
			$scope.productFilter.category = category || {};
			$scope.list();
		};

		$scope.getQuantity = function(){
			$http
			.get('/api/products/quantity', {
				params: {
					productBy: $scope.productBy 
				}
			})
			.then(function(quantity){
				$scope.pagination.totalQty = quantity.data;
			}, function(errorResponse) {
				
			});
		};

		$scope.findOneEdit = function(){

			if(!$stateParams.productId) $location.path('/');

			$scope.product = Products.get({productId:$stateParams.productId},function(){
				$scope.$broadcast('findEditPhotos');
				$scope.categories = Categories.query();
			});

		};


		$scope.pageChange = function(){
			$scope.list();
		};

		function setTableHeader() {
			$scope.tableHeader = {
				name:'ชื่อ',
				model:'รุ่น',
				brand:'แบรนด์',
				price:'ราคา',
				color:'สี',
				quantity:'จำนวน',
				photo:'รูป',
				category:'หมวดหมู่',
				slug:'slug'
			};
		}

		$scope.initCategories = function(){
			$scope.categories = Categories.query();
		};

		$scope.initColors = function(){
			var colors = [];
			
			angular.forEach(EventColors,function(val,key){
				colors.push(val);
			});

			$scope.colors = colors;
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
					$scope.products[index].selected = true;
				}else{
					$scope.products[index].selected = false;
					$scope.productChecked = false;
				}
			},
			updateSelectAll:function(isChecked){
				if(isChecked){
					for(var i=0 ; i<$scope.products.length;i++){
						$scope.products[i].selected = true;
					}

				}else{
					for(var a=0 ; a<$scope.products.length;a++){
						$scope.products[a].selected = false;
					}

				}
			}
		};

		$scope.$watch('searchQuery', function(){
			if($scope.searchQuery === '') {
				$scope.list();
			}
		});

		$scope.$on('photoUploadCompleted',function(event,photoId){
			photoIdList.push(photoId);				
		});


		$scope.$on('photoRemoved',function(event,photoIndex){
			photoIdList.splice(photoIndex,1);			
		});

	}
	]);