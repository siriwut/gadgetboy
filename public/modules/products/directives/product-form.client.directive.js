'use strict';

angular.module('products').directive('productForm', [
	function() {
		return {
			restrict: 'A',
			link: function postLink (scope, element, attrs) {
				element.ready(function(){

					//element.find('input')[0].focus();

					element.on('submit',function(){	
						var firstInvalidElem = element.find('.ng-invalid')[0];

						if(firstInvalidElem){
							firstInvalidElem.focus();
						}
					});

				});
				
			}
		};
	}
	]);