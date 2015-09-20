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
 	product.user = req.user;
 	
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
 	if(req.query.categoryId){
 		Product.find({category:req.query.categoryId}).sort('-created').populate('user','displayName').populate('category','name').populate('photos').exec(function(err, products) {
 			
 			if (err) {
 				return res.status(400).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			} else {
 				res.json(products);
 			}
 		});
 	}else{

 		Product.find().sort('-created').populate('user','displayName').populate('category','name').populate('photos').exec(function(err, products) {
 			if (err) {
 				return res.status(400).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			} else {
 				res.json(products);
 			}
 		});

 	}

 	
 };

 exports.listByCategoryId = function(req,res){
 	console.log('Match Method!!');
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
 	if (req.product.user.id !== req.user.id) {
 		return res.status(403).send('User is not authorized');
 	}
 	next();
 };

 exports.productByCategoryID = function(req,res,next,id){
 	Product.find({'category':id}).populate('user').populate('category','name').populate('photos').exec(function(err,product){
 		if(err)return next(err);
 		if(!product)return next(new Error('Failed to load product ' + id));
 		console.log('Match Params!!');
 		req.product = product;
 		next();
 	});
 };


