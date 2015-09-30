'use strict';


angular.module('categories').directive('categoryForm', [
	function() {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.ready(function(){
					element.on('submit',function(event){	
						
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