'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Product = mongoose.model('Product'),
 Category = mongoose.model('Category'),
 async = require('async'),
 _ = require('lodash');





 exports.displayWall = function(req, res) {
 	async.waterfall([
 		function(done){
 			Category.find().lean().exec(function(err,categories){
 				done(err,categories);
 			});

 		},function(categories,done){
 			
 			async.eachSeries(categories,function(category,cb){
 				var index = categories.indexOf(category);

 				categories[index].products = [];

 				Product.findRandom({ category: category._id }).where({ price: { $gt: 0 },quantity: { $gt:0 } }).limit(4).populate('photos').exec(function(err,products){
 					if(err) return done(err);
 					
 					categories[index].products = products;

 					if(index === categories.length-1){
 						
 						res.json(categories);
 					}	
 					
 					cb();
 				});			

 				
 			},function(err){
 				if(err) throw err;
 			});

 		}],function(err){
 			if(err)
 				return res.status(400).send(err);
 		});

 };
