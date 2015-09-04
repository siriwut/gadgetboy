'use strict';

angular.module('products').controller('ProductController', ['$scope','$rootScope','Authentication','Products',
	function($scope,$rootScope,Authentication,Products) {
		$scope.product = {
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
		};

		

		$scope.$on('photoUploadCompleted',function(event,photo){
			$scope.product.photos.push(photo._id);		
		});

		$scope.$on('photoRemoved',function(event,photoIndex){
			$scope.product.photos.splice(photoIndex,1);			
		});

		

		$scope.create = function(){
			var product = new Products(this.product);
			product.$save(function(data){
				console.log(data);
			},function(err){
				//console.log('Tape'+err.data.message);
			});
		};

		$scope.list = function(){
			$scope.products =  Products.query();			
		};
	}
	]);