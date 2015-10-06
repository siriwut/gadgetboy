'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 _ = require('lodash'),
 async = require('async'),
 Customer = mongoose.model('Customer'),
 Product = mongoose.model('Product'),
 errorHandler = require('./errors.server.controller');

/**
 * Create a Cart
 */
 exports.add = function(req, res, next) {
 	if(req.user){
 		async.waterfall([function(done){
 			if(req.body.productId){

 				Customer.findOne({_id:req.user._id},function(err,customer){
 					if(!customer){
 						return res.status(400).send({message:'ไม่มีชื่อลูกค้านี้ในระบบ'});
 					}
 					done(err,customer);
 				});

 			}else{
 				return res.status(400).send({message:'กรุณาระบุสินค้า'});
 			}

 		},function(customer,done){
 			//check product in cart
 			Customer.findOne({_id:customer._id,cart:{$elemMatch:{product:req.body.productId}}},
 				function(err,customerWithCart){
 					var hasThisProductInCart = customerWithCart? true : false;
 					done(err,hasThisProductInCart,customer);
 				});

 		},function(hasThisProductInCart,customer,done){
 			//check product in stock
 			Product.findById(req.body.productId,function(err,product){
 				done(err,hasThisProductInCart,customer,product);
 			});
 		},function(hasThisProductInCart,customer,product,done){

 			if(!hasThisProductInCart){
 				if(product.quantity > 0){

 					customer.cart.push({product:req.body.productId});
 					customer.save(function(err,customer){
 						
 						done(err,customer);
 					});
 				}else{
 					return res.status(400).send({message:'สิน้คาชิ้นนี้หมดแล้วค่ะ'});
 				}

 			}else{

 				//console.log(customer.cart);
 				var checkCart = _.findIndex(customer.cart,'product',mongoose.Types.ObjectId(req.body.productId));
 				

 				if(customer.cart[checkCart].quantity <= product.quantity){

 					Customer.update({_id:customer._id,'cart.product':req.body.productId},
 						{'$inc':{'cart.$.quantity':1}},function(err,isUpdated){
 							if(isUpdated){
 								Customer.findById(customer._id,function(err,customer){
 									done(err,customer);
 								});
 							}	
 							
 						});

 				}else{
 					return res.status(400).send({message:'สิค้าชิ้นนี้มีเพียง '+product.quantity+' ชิ้นค่ะ'});
 				}
 			}
 		},function(customer,done){
 			//find cart with products
 			Customer.findOne({_id:customer._id}).populate('cart.product').exec(function(err,customer){
 				if(err){
 					done(err);
 				}

 				res.json(customer.cart);
 			});

 		}],function(err){
 			if(err) return next(err);
 		});

}else{

	if(req.cookies.cart){
		console.log('Cookies');
	}else{

		console.log('No Cookies Class');
	}

}

};

/**
 * Show the current Cart
 */
 exports.read = function(req, res) {

 };

/**
 * Update a Cart
 */
 exports.update = function(req, res) {

 };

/**
 * Delete an Cart
 */
 exports.delete = function(req, res) {

 };

/**
 * List of Carts
 */
 exports.list = function(req, res) {

 };