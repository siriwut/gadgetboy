'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 _ = require('lodash');

 var Product = mongoose.model('Product'),
 Category = mongoose.model('Category');


 exports.listProductByCategory = function(req,res){
 	var pagination = {
 		current: 1,
 		perPage: 20,
 		skip: 0
 	};

 	pagination.skip = (pagination.current - 1) * pagination.perPage;

 	Category
 	.findOne({ slug: req.params.categorySlug })
 	.lean()
 	.exec(function(err,category){
 		if(err) {
 			return res.status(400).send(err);
 		}

 		if(!category) {
 			return res.status(400).send({ 
 				message:'Cannot load Category' + req.params.categorySlug 
 			});
 		}

 		Product
 		.find({ category: category._id, price: { $gt: 0 } })
 		.skip(pagination.skip)
 		.limit(pagination.perPage)
 		.populate('user')
 		.populate('category')
 		.populate('photos')
 		.exec(function(err,products){
 			if(err){
 				return res.status(400).send(err);
 			}
 			if(!products){
 				return res.status(400).send({
 					message: 'Cannot load Product in Category'+req.params.categorySlug
 				});
 			}

 			category.products = products;
 
 			res.json(category);
 		});

 	});
 };

 exports.productByCategoryID = function(req,res,next,id){
 	Product
 	.find({category:id, price:{ $gt:0 } })
 	.populate('user')
 	.populate('category','name')
 	.populate('photos')
 	.exec(function(err,products){
 		if(err)return next(err);
 		if(!products)return next(new Error('Failed to load product ' + id));
 		
 		req.products = products;
 		next();
 	});
 };

 