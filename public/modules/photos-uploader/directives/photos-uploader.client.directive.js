'use strict';

angular.module('photos-uploader').directive('photosUploader', [
	function() {
		return {
			templateUrl: 'modules/photos-uploader/views/photos-uploader.client.view.html',
			controller: 'PhotosUploaderCtrl as photosUploader',
			restrict: 'E'
		};
	}
]);