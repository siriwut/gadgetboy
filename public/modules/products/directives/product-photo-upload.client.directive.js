'use strict';

angular.module('products')
.controller('productPhotoUploadController',['$scope','$timeout','$interval','$state','Authentication','Upload','Photos',function($scope,$timeout,$interval,$state,Authentication,Upload,Photos){
	$scope.log='';
	$scope.photoPreviewList = [];

	var photoTrash = [];

	$scope.$watch('files',function(){
		$scope.upload($scope.files);
	});

	$scope.upload = function (files) {

		if (files && files.length) {	

			angular.forEach(files,function(file,index){

				var photoObject = {photo:null,progressPercentage:0,isAbort:false};
				$scope.photoPreviewList.push(photoObject);

				var lastIndex = $scope.photoPreviewList.length - 1;

				Upload.upload({
					url: '/api/photos',
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					$scope.photoPreviewList[lastIndex].progressPercentage = progressPercentage;
					$scope.photoPreviewList[lastIndex].isAbort = true;

				}).success(function (data, status, headers, config) {
					$timeout(function() {
						$scope.photoPreviewList[lastIndex].isAbort = false;
						$scope.photoPreviewList[lastIndex].progressPercentage = 0;
						$scope.photoPreviewList[lastIndex].photo = data;
						$scope.$emit('photoUploadCompleted',data._id);
					});

				}).error(function (data, status, headers, config) {
					console.log('error status: ' + status);
				});

			});

			
		}
	};

	$scope.remove = function(index){		
		var photoPreview = $scope.photoPreviewList[index].photo;

		if($state.current.name ==='adminPanel.editProduct'){
			if(!$scope.photoPreviewList[index].isAbort){
				photoTrash.push($scope.photoPreviewList[index]);
				$scope.photoPreviewList.splice(index,1);
			}else{
				$scope.photoPreviewList.splice(index,1);
				Upload.abort();
			}

		}else{
			if(!$scope.photoPreviewList[index].isAbort){
				$scope.photoPreviewList.splice(index,1);
				var photo = new Photos(photoPreview);
				photo.$remove();
				$scope.$emit('photoRemoved',index);

			}else{
				$scope.photoPreviewList.splice(index,1);
				Upload.abort();
			}

		}

		
	};



	$scope.$on('findEditPhotos',function(){
		angular.forEach($scope.product.photos,function(photo,index){
			var lastIndex = $scope.photoPreviewList.length - 1;
			var photoObject = {photo:photo,originalPhoto:true};

			$scope.photoPreviewList.push(photoObject);
			$scope.$emit('photoUploadCompleted',photo._id);

		});
	});

	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if(fromState.name==='adminPanel.createProduct')clearPhotoPreview();

		if(fromState.name==='adminPanel.editProduct'){
			clearPhotoTrash();
			clearPhotoPreview();
		}
	});

	$scope.$on('onClearForm',function(){
		$scope.photoPreviewList = [];
	});

	$scope.$on('updated',function(){
		setOriginalPhoto();
		clearPhotoTrashAll();
	});


	var clearPhotoPreview = function(){	
		angular.forEach($scope.photoPreviewList,function(photoPreview,index){
			if(!photoPreview.originalPhoto){
				var photo = new Photos(photoPreview.photo);
				photo.$remove({photoId:photoPreview.photo._id});
			}
		});
		
	};

	var clearPhotoTrash = function(){
		angular.forEach(photoTrash,function(photoObject){
			if(!photoObject.originalPhoto){
				var photo = new Photos(photoObject.photo);
				photo.$remove();
			}
		});	
	};

	var clearPhotoTrashAll = function(){
		angular.forEach(photoTrash,function(photoObject){
			var photo = new Photos(photoObject.photo);
			photo.$remove();
			
		});	
	};

	var setOriginalPhoto = function(){
		for(var i in $scope.photoPreviewList){
			$scope.photoPreviewList[i].originalPhoto = true;
		}
	};



}])
.directive('productPhotoUpload', [
	function() {
		return {
			templateUrl: 'modules/products/directives/product-photo-upload.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				
			}
		};
	}
	]);