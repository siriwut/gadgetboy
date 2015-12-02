'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 _ = require('lodash');

 var Product = mongoose.model('Product'),
 Category = mongoose.model('Category');


 exports.listProductByCategory = function(req,res){
 	Category.findOne({slug: req.params.categorySlug}).exec(function(err,category){
 		if(err) {
 			return res.status(400).send(err);
 		}

 		if(!category) {
 			return res.status(400).send({ message:'Cannot load Category' + req.params.categorySlug });
 		}

 		Product.find({category:category._id, price:{$gt:0}}).populate('user').populate('category').populate('photos').exec(function(err,products){
 			if(err)return res.status(400).send(err);
 			if(!products)return res.status(400).send({message:'Cannot load Product in Category'+req.params.categorySlug});

 			res.json(products);
 		});

 	});

 	
 };

 exports.productByCategoryID = function(req,res,next,id){
 	Product.find({category:id, price:{$gt:0}}).populate('user').populate('category','name').populate('photos').exec(function(err,products){
 		if(err)return next(err);
 		if(!products)return next(new Error('Failed to load product ' + id));
 		
 		req.products = products;
 		next();
 	});
 };

 