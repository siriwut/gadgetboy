'use strict';

angular.module('shop')
.directive('productImagePreview', ['$modal',
	function($modal) {
		return {
			restrict: 'A',
			scope:{
				image:'='
			},

			link: function (scope, element, attrs) {
				element.on('click',function(event){
					var modalInstance = $modal.open({
						templateUrl:'/modules/shop/directives/templates/product-image-preview-modal.html',
						controller:'modalInstanceCtrl',
						size:'lg',
						resolve:{
							image:function(){
								return scope.image;
							}
						}
					});
				});
			}
		};
	}
	])
.controller('modalInstanceCtrl',['$scope','$modalInstance','image',
	function($scope,$modalInstance,image){
		$scope.image = image;

		$scope.close = function(){
			 $modalInstance.dismiss('cancel');
		};
	}]);


