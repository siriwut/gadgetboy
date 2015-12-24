'use strict';

module.exports = {
	app: {
		title: 'gadgetboy',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
			'public/lib/bootstrap/dist/css/bootstrap.css',
			'public/lib/jquery-simplecolorpicker/jquery.simplecolorpicker.css',
			'public/lib/jquery-simplecolorpicker/jquery.simplecolorpicker-regularfont.css',
			'public/lib/jquery-simplecolorpicker/jquery.simplecolorpicker-glyphicons.css',
			'public/lib/jquery-simplecolorpicker/jquery.simplecolorpicker-fontawesome.css',
			'public/lib/textAngular/dist/textAngular.css',
			'public/lib/font-awesome/css/font-awesome.css',
			'public/lib/angular-loading-bar/build/loading-bar.min.css'
			],
			js: [
			'public/lib/jquery/dist/jquery.min.js',
			'public/lib/angular/angular.js',
			'public/lib/angular-resource/angular-resource.js', 
			'public/lib/angular-cookies/angular-cookies.js', 
			'public/lib/angular-animate/angular-animate.js', 
			'public/lib/angular-touch/angular-touch.js', 
			'public/lib/angular-sanitize/angular-sanitize.js', 
			'public/lib/angular-ui-router/release/angular-ui-router.js',
			'public/lib/angular-ui-utils/ui-utils.js',
			'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
			'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
			'public/lib/ng-file-upload/ng-file-upload.js',
			'public/lib/angular-flash-alert/dist/angular-flash.min.js',
			'public/lib/jquery-simplecolorpicker/jquery.simplecolorpicker.js',
			'public/lib/textAngular/dist/textAngular-rangy.min.js',
			'public/lib/textAngular/dist/textAngular-sanitize.min.js',
			'public/lib/textAngular/dist/textAngular.min.js',
			'public/lib/lodash/lodash.min.js',
			'public/lib/angular-confirm-modal/angular-confirm.min.js',
			'public/lib/angular-loading-bar/build/loading-bar.min.js'
			]
		},
		css: [
		'public/modules/**/css/*.css'
		],
		js: [
		'public/config.js',
		'public/application.js',
		'public/modules/*/*.js',
		'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
		'public/lib/angular-mocks/angular-mocks.js',
		'public/modules/*/tests/*.js'
		]
	}
};