'use strict';

angular.module('products')
.controller('RelatedProductCreatorCtrl',['$scope','$attrs','Products',function($scope,$attrs,Products){

	if(!$scope.ngModel){
		$scope.ngModel = [];
	}


	$scope.addRelatedProduct = function(){
		if(!$scope.productId){
			$scope.relatedProductError = 'กรุณาระบุรหัสสินค้า';
			return; 
		}

		$scope.relatedProductError = null;

		Products.get({productId:$scope.productId},function(res){
			$scope.ngModel.push($scope.productId);
			$scope.productId = null;
		},function(err){
			$scope.relatedProductError = err.data.message;
		});		
	};


	$scope.removeRelatedProduct = function(index){
		$scope.ngModel.splice(index,1);
	};



	this.editRelatedProduct = function(index,value){
		if(!value){
			$scope.relatedProductError = 'กรุณาระบุรหัสสินค้า';
			return ;
		}
		
		Products.get({productId:value},function(res){
			$scope.ngModel[index] = value;
		},function(err){

			$scope.$broadcast('editError',err.data.message);
		});	
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
			controller:'RelatedProductCreatorCtrl'
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
						element.parent().siblings('.text-edit-error').remove();
						textRelatedProduct.readOnly = true;
						this.text = 'แก้ไข';
						ctrl.editRelatedProduct(attr.index,textRelatedProduct.value);
					}
				});

				scope.$on('editError',function(event,message){
					textRelatedProduct.readOnly = false;
					element.parent().siblings('.text-edit-error').remove();
					element.parent().after('<p class="text-danger text-edit-error" >'+message+'</p>');
				});
				

			}
		};
	}]);