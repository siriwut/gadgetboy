'use strict';

angular.module('products').controller('ProductsController', ['$scope','$rootScope','$location','$state','$stateParams','Authentication','Products','Categories','filterFilter','Flash','EventColors','Colors',
	function($scope,$rootScope,$location,$state,$stateParams,Authentication,Products,Categories,filterFiler,Flash,EventColors,Colors) {

		var photoIdList = [];
		var productCheckedList = [];

		$scope.create = function(){
			var product = new Products(this.product);
			
			product.photos = photoIdList;

			if(this.product.category){
				product.category = this.product.category._id;
			}else{
				return;
			}

			product.$save(function(data){
				var message = 'เพิ่มสินค้า '+data.name+' <strong> เรียบร้อยแล้ว</strong>';

				Flash.create('success',message);

				$scope.product = null;
				photoIdList = [];
				$scope.$broadcast('onClearForm');


				$state.go('adminPanel.editProduct',{productId:product._id});

			},function(err){		
				if(err){
					var message = 'เพิ่มสินค้า <strong>ล้มเหลว</strong>';
					Flash.create('error',message);
				}
			});
		};


		$scope.update = function(){
			var product = $scope.product;
			product.photos = photoIdList;

			if($scope.product.category){
				product.category = $scope.product.category._id;
			}
			
			product.$update(function(response) {
				

				$scope.product = response;
				$scope.$broadcast('updated');

				var message = 'แก้ไขสินค้า '+response.name+' <strong> เรียบร้อยแล้ว</strong>';

				Flash.create('success',message);

				$state.go('adminPanel.editProduct',{productId:product._id});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.list = function(){
			$scope.tableHeader = {
				name:'ชื่อ',
				model:'รุ่น',
				brand:'แบรนด์',
				price:'ราคา',
				color:'สี',
				quantity:'จำนวน',
				photo:'รูป',
				category:'หมวดหมู่'
			};
			$scope.products =  Products.query(function(){
				for(var i=0; i<$scope.products.length;i++){
					$scope.products[i].selected = false;
				}

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
				});
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
						});

					});


				}
			}
		};

		$scope.findOneEdit = function(){
			$scope.product = Products.get({productId:$stateParams.productId},function(){
				$scope.$broadcast('findEditPhotos');
				$scope.categories = Categories.query();
			});



		};

		$scope.initCategories = function(){
			$scope.categories = Categories.query();

		};

		$scope.initColors = function(){
			$scope.colors = EventColors;
			
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


		$scope.$on('photoUploadCompleted',function(event,photoId){
			photoIdList.push(photoId);				
		});


		$scope.$on('photoRemoved',function(event,photoIndex){
			photoIdList.splice(photoIndex,1);			
		});



				/*$scope.product = {
				name:'Speaker',
				model: 'Speaker',
				brand: 'Tape',
				shortDescription: 'Speaker Desc',
				description: 'Desc',
				price: 20,
				quantity:1,
				sale:{
					onSale:true,
					percen:10
				},
				color:'red',
				tags:['speaker','tape'],
				photos:[]
			};*/
		}
		]);