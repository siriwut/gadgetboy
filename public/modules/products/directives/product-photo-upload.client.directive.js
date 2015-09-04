'use strict';

angular.module('products')
.controller('productPhotoUploadController',['$scope','$timeout','$interval','Authentication','Upload','Photos',function($scope,$timeout,$interval,Authentication,Upload,Photos){
	$scope.log='';
	$scope.photoPreviewList = [];

	$scope.$watch('files',function(){
		$scope.upload($scope.files);
	});

	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		clearPhotoPreview();
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
						$scope.$emit('photoUploadCompleted',data);
					});

				});

			});

			
		}
	};


	$scope.remove = function(index){		
		var photoPreview = $scope.photoPreviewList[index].photo;

		if(!$scope.photoPreviewList[index].isAbort){
			$scope.photoPreviewList.splice(index,1);
			var photo = new Photos(photoPreview);
			photo.$remove({photoId:photo._id});

			$scope.$emit('photoRemoved',index);
			
		}else{
			$scope.photoPreviewList.splice(index,1);
			Upload.abort();
		}

		
	};

	var clearPhotoPreview = function(){
		if($scope.photoPreviewList.length){
			angular.forEach($scope.photoPreviewList,function(photoPreview,index){
				var photo = new Photos(photoPreview.photo);
				photo.$remove({photoId:photoPreview.photo._id});
			});
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