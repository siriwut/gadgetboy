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
 Photo = mongoose.model('Photo'),
 Category = mongoose.model('Category'), 
 errorHandler = require('./errors.server.controller'),
 _ = require('lodash');



/**
 * Create a Product
 */
 exports.create = function(req, res) {

 	var product = new Product(req.body);
 	var message = null;

 	product.user = req.user;
 	product.slug = product.name;

 	product.save(function(err){	
 		if(err){
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
 	res.json(req.product);
 };

/**
 * Update a Product
 */
 exports.update = function(req, res) {
 	var product = req.product;
 	
 	product = _.extend(req.product,req.body);

 	product.save(function(err,product) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			
 			Category.findById(product.category).exec(function(err,category){
 				if(err){
 					return res.status(400).send({
 						message: errorHandler.getErrorMessage(err)
 					});
 				}else{
 					product.category = category;
 					res.json(product);
 				}
 			});
 			
 		}
 	});

 };

/**
 * Delete an Product
 */
 exports.delete = function(req, res) {
 	var product = req.product;

 	product.remove(function(err,product){
 		if(err){
 			return res.status(400).send({
 				message:errorHandler.getErrorMessage(err)
 			});
 		}else{

 			_.forEach(product.photos,function(id,key){
 				Photo.findById(id).exec(function(err,photo){
 					if(err){
 						return res.status(400).send({
 							message: errorHandler.getErrorMessage(err)
 						});
 					}else{
 						
 						photo.remove(function(){
 							if (err) {
 								return res.status(400).send({
 									message: errorHandler.getErrorMessage(err)
 								});
 							} else {
 								var photoRemove = './public/photos_upload/'.concat(photo.name);
 								fs.remove(photoRemove, function (err) {
 									if (err){
 										return res.status(400).send({
 											message: errorHandler.getErrorMessage(err)
 										});
 									}
 								});
 							}
 						});
 					}
 				});

 			});
 			
 			res.json(product);
 		}

 	});

 };

/**
 * List of Products
 */
 exports.list = function(req, res) {
 	var message = null;
 	var page = 0;
 	var nPerPage = 20;

 	if(req.query.page) page = req.query.page;

 	//query for admin can see
 	Product.find().skip(page>0?(page-1)*nPerPage:0).limit(nPerPage).sort('-created').populate('user','displayName').populate('category','name').populate('photos').exec(function(err, products) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.json(products);
 		}
 	});


 };


 exports.getQuantity = function(req,res){
 	
 	Product.count(function(err,quantity){
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.json(quantity);
 		}
 	}); 		

 };



 exports.productByID = function(req,res,next,id){
 	Product.findById(id).populate('user').populate('category').populate('photos').exec(function(err,product){
 		if(err)return next(err);
 		if(!product)return next(new Error('Failed to load product ' + id));

 		req.product = product;
 		next();
 	});
 };

 exports.hasAuthorization = function(req, res, next) {
 	console.log(req.user.id);
 	if (req.product.user.id !== req.user.id) {
 		return res.status(403).send('User is not authorized');
 	}
 	next();
 };



