'use strict';
var fs = require('fs-extra'),
path = require('path'),
url  = require('url'),
uuid = require('uuid'),
slash = require('slash');

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Product = mongoose.model('Product'),
 errorHandler = require('./errors.server.controller'),
 _ = require('lodash');



/**
 * Create a Product
 */
 exports.create = function(req, res) {

 	var product = new Product(req.body);
 	product.user = req.user;
 	
 	product.save(function(err){	
 		if(err){
 			console.log(err);
 			return res.status(400).send({
 				message:errorHandler.getErrorMessage(err)
 			});
 		}else{
 			res.json(product);
 		}

 	});

 };

/**
 * Show the current Product
 */
 exports.read = function(req, res) {

 };

/**
 * Update a Product
 */
 exports.update = function(req, res) {

 };

/**
 * Delete an Product
 */
 exports.delete = function(req, res) {

 };

/**
 * List of Products
 */
 exports.list = function(req, res) {
 	Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(products);
		}
	});
 };

 exports.productByID = function(req,res,next,id){
 	Product.find(id).populate('user').exec(function(err,product){
 		if(err)return next(err);
 		if(!product)return next(new Error('Failed to load product ' + id));

 		req.product = product;
 		next();
 	});
 };

 exports.uploadPhotos = function(req, res){
 	var temp = req.files.file;
 	var dest = './public/photos_upload/'+uuid.v1()+path.extname(temp.path);

 	var photoReviewPaths = url.resolve(req.protocol+'://'+req.get('host'),'/tmp/'+path.basename(req.files.file.path));

 	res.json({photoTempUrl:photoReviewPaths});

 	/*fs.move(temp.path,dest,function(err){
 		if(err)console.log(err);
 		res.json(req.files);
 	});*/
};
