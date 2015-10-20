'use strict';

angular.module('products')
.controller('RelatedProductCreatorCtrl',['$scope',function($scope){

	if(!$scope.ngModel){
		$scope.ngModel = [];
	}


	$scope.addRelatedProduct = function(){
		$scope.ngModel.push($scope.productId);
		$scope.productId = null;
	};


	$scope.removeRelatedProduct = function(index){
		$scope.ngModel.splice(index,1);
	};



	this.editRelatedProduct = function(index,value){
		$scope.ngModel[index] = value;
	};

}])

.directive('relatedProductCreator', [
	function() {
		return {
			templateUrl: '/modules/products/directives/templates/related-product-creator.html',
			restrict: 'EA',
			require:'^ngModel',
			scope:{
				ngModel:'='
			},
			transclude:true,
			controller:'RelatedProductCreatorCtrl',
		};
	}])

.directive('btnEditRelatedProduct',[
	function(){
		return {
			restrict:'A',
			require:'^relatedProductCreator',
			link:function(scope,element,attr,ctrl){

				var textRelatedProduct = element.siblings('.text-related-product')[0];
				
				element.on('click',function(){
					if(textRelatedProduct.readOnly){
						textRelatedProduct.readOnly = false;
						this.text = 'บันทึก';
					}else{
						textRelatedProduct.readOnly = true;
						this.text = 'แก้ไข';
						ctrl.editRelatedProduct(attr.index,textRelatedProduct.value);
					}
				});

			}
		};
	}]);