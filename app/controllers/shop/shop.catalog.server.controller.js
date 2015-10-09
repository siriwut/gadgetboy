'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 _ = require('lodash');

 var Product = mongoose.model('Product'),
 Category = mongoose.model('Category');


 exports.listProductByCategory = function(req,res){
 	res.json(req.products);
 };

 exports.productByCategoryID = function(req,res,next,id){
 	Product.find({category:id, price:{$gt:0}}).populate('user').populate('category','name').populate('photos').exec(function(err,products){
 		if(err)return next(err);
 		if(!products)return next(new Error('Failed to load product ' + id));
 		
 		req.products = products;
 		next();
 	});
 };