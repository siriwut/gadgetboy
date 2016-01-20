'use strict';
var fs = require('fs-extra'),
path = require('path'),
url  = require('url'),
uuid = require('uuid'),
slash = require('slash'),
slug = require('slug'),
async = require('async');

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
 	Product
 	.findById(req.params.productId)
 	.populate('user','displayName')
 	.populate('category')
 	.populate('photos')
 	.populate('relatedProducts')
 	.exec(function(err, product){
 		if(err) {
 			return res.status(400).send({
 				message:'รหัสสินค้าไม่ถูกต้อง'
 			});
 		}

 		if(!product){
 			return res.status(400).send({
 				message:'ไม่พบสินค้าชิ้นนี้'
 			});
 		}

 		var opt = { path: 'relatedProducts.photos', model: 'Photo' };

 		Product.populate(product, opt, function(err, product) {
 			if(err) {
 				return res.status(400).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}


 			res.jsonp(product);
 		});
 	});
 };


 exports.readBySlug = function(req,res){
 	Product.findOne(req.query).lean().populate('user','displayName').populate('category').populate('photos').populate('relatedProducts').exec(function(err,product){

 		if(err) return res.status(400).send(err);
 		if(!product) return res.status(400).send({message:'Failed to load product'});

 		
 		var opts = {
 			path:'photos',
 		};

 		Product.populate(product.relatedProducts,opts,function(err,products){

 			if(err) {
 				return res.status(400).send(err);
 			}

 			product.relatedProducts = products;
 			res.jsonp(product);
 		});
 		
 	});
 };

/**
 * Update a Product
 */
 exports.update = function(req, res) {
 	async.waterfall([function(done){
 		Product.findById(req.params.productId).populate('user','displayName').populate('category').populate('photos').exec(function(err,product){
 			done(err,product);
 		});
 	},function(productReq,done){
 		if(!productReq) {
 			return res.status(400).send({message:'Failed to load product'});
 		}

 		var product = productReq;

 		product = _.extend(productReq,req.body);
 		product.slug = slug(product.name,{lower:true});

 		product.save(function(err,product) {
 			done(err,product);
 		});

 	},function(product,done){
 		Category.findById(product.category).exec(function(err,category){
 			done(err,category,product);
 		});

 	},function(category,product,done){
 		product.category = category;
 		res.json(product);
 	}],function(err){
 		if(err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		}	
 	});

 };

/**
 * Delete an Product
 */
 exports.delete = function(req, res) {
 	
 	Product.findById(req.params.productId).populate('user','displayName').populate('category').populate('photos').exec(function(err,product){
 		if(err)return res.status(400).send(err);
 		if(!product)return res.status(400).send({message:'Failed to load product'});

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
 	});
};

/**
 * List of Products
 */
 exports.list = function(req, res) {
 	var message = null;
 	var page = req.query.page || 1;
 	var nPerPage = req.query.perPage || 20;
 	var currentPage = (page - 1) * nPerPage;
 	var productBy = req.query.productBy || 'all';
 	var byCategory = req.query.byCategory || '';
 	var search = req.query.search || '';
 	var where = {};

 	switch(productBy) {
 		case 'sale':
 		where = { 'sale.onSale': true };
 		break;
 		case 'soleOut':
 		where = { $or: [{ quantity: { $eq: 0 } }, { quantity: { $lt: 0 } }] };
 		break;
 	}

 	if(byCategory) {
 		where.category = byCategory;
 	}

 	if(search) {
 		where.$text = { $search: search };
 	}
 	
 	//query for admin can see
 	Product
 	.find(where)
 	.skip(currentPage)
 	.limit(nPerPage)
 	.sort('-created')
 	.populate('user','displayName')
 	.populate('category','name')
 	.populate('photos')
 	.exec(function(err, products) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(products);
 		}
 	});
 };


 exports.getQuantity = function(req, res) {
 	var byCategory = req.query.byCategory || '';
 	var productBy = req.query.productBy || 'all';
 	var priceNotZero = !! parseInt(req.query.priceNotZero);
 	var where = {};
 	
 	switch(productBy) {
 		case 'sale':
 		where = { 'sale.onSale': true };
 		break;
 		case 'soleOut':
 		where = { quantity: { $eq: 0 } };
 		break;
 	}

 	if(byCategory) {
 		where.category = mongoose.Types.ObjectId(byCategory);
 	}
 	
 	if(priceNotZero) {
 		where.$or = [{ price: { $ne: 0 } }, { price: { $lt: 0 } }];
 	}
 	
 	Product.count(where, function(err,quantity){
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		}
 		
 		res.json(quantity);	
 	});

 };


 exports.search = function(req,res){
 	Product
 	.find({
 		$text: { 
 			$search: req.query.q 
 		},
 		price:{ 
 			$gt: 0 
 		},
 		category:{ 
 			$ne: null 
 		}})
 	.populate('user','displayName')
 	.populate('category')
 	.populate('photos')
 	.exec(function(err,result){
 		if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 		res.jsonp(result);
 	});
 };



 exports.productByID = function(req,res,next,id){
 	Product.findById(id).populate('user','displayName').populate('category').populate('photos').exec(function(err,product){
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



