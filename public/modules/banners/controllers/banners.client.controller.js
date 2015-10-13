'use strict';

angular.module('banners').controller('BannersCtrl', ['$scope','$http','Upload','Flash',
	function($scope,$http,Upload,Flash) {

		$scope.banners = [];

		$scope.$watch('file',function(){
			$scope.addBanner($scope.file);
		});
		
		$scope.addBanner = function(file){
			if(!file) return;
			// banner image width:1200 and height:400
			var upload = Upload.upload({url:'/api/banners',file:file});

			upload.progress(function(evt){

			}).success(function(data, status, headers, config){
				//console.log(data);
				$scope.banners.unshift(data);

			}).error(function(data, status, headers, config){
				Flash.create('danger',data);
			});
		};

		$scope.displayBanners = function(){
			$http.get('/api/banners').then(function(res){
				$scope.banners = res.data;
			},function(err){
				console.log(err.data);
			});
		};

		$scope.removeBanner = function(id,index){
			$http.delete('/api/banners/'+id).then(function(res){
				$scope.banners.splice(index,1);
			},function(err){
				console.log(err.data);
			});
		};
	}
	]);