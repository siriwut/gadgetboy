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
 						return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});
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
 					//console.log('Add');
 					customer.cart.push({product:req.body.productId,quantity:req.body.quantity});
 					customer.save(function(err,customer){
 						
 						done(err,customer);
 					});
 				}else{
 					return res.status(400).send({message:'สิน้คา '+product.name+' หมดแล้วค่ะ'});
 				}

 			}else{

 				
 				var checkCart = _.findIndex(customer.cart,'product',mongoose.Types.ObjectId(req.body.productId));
 				
 				if(customer.cart[checkCart].quantity >= product.quantity)
 					return res.status(400).send({message:'มีสินค้า <strong>'+product.name+'<strong> ในร้านจำนวน '+product.quantity+' ชิ้นค่ะ'});

 				Customer.update({_id:customer._id,'cart.product':req.body.productId},
 					{'$inc':{'cart.$.quantity':req.body.quantity}},function(err,isUpdated){

 						if(isUpdated){
 							Customer.findById(customer._id,function(err,customer){
 								done(err,customer);
 							});
 						}	

 					});

 				
 			}
 		},function(customer,done){
 			//find cart with products
 			Customer.findOne({_id:req.user._id}).lean().populate({path:'cart.product'}).exec(function(err,customer){
 				var options = {
 					path:'cart.product.photos',
 					model:'Photo'
 				};

 				done(err,customer,options);
 				
 			});


 		},function(customer,options,done){
 			Customer.populate(customer,options,function(err,customer){
 				if(err) done(err);

 				res.jsonp(customer.cart);
 			});

 		}],function(err){
 			if(err) return next(err);
 		});

}else{

	if(!req.body.quantity) return res.status(400).send({message:'กรุณาระบุจำนวนสินค้า'});

	if(!req.cookies.cart){
		var cartWithProducts = [];

		Product.findById(req.body.productId).populate('photos').exec(function(err,product){
			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
			if(!product) return res.status(400).send({message:'ไม่พบสินค้าชิ้นนี้'});
			if(req.body.quantity >= product.quantity) return res.status(400).send({message:'มีสินค้า <strong>'+product.name+'<strong> ในร้านจำนวน '+product.quantity+' ชิ้นค่ะ'}); 
			
			cartWithProducts.push({product:product,quantity:req.body.quantity});

			res.cookie('cart',cartWithProducts, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 });
			res.jsonp(cartWithProducts);
		});

	}else{

		var cartWithProducts2 = req.cookies.cart;		
		var productInCartIndex = _.findIndex(cartWithProducts2,'product._id',req.body.productId);

		
		if(productInCartIndex > -1){

			cartWithProducts2[productInCartIndex].quantity += req.body.quantity;


			if(cartWithProducts2[productInCartIndex].quantity > cartWithProducts2[productInCartIndex].product.quantity)
				return res.status(400).send({message:'มีสินค้า <strong>'+cartWithProducts2[productInCartIndex].product.name+'<strong> ในร้านจำนวน '+cartWithProducts2[productInCartIndex].product.quantity+' ชิ้นค่ะ'});
			
			res.cookie('cart',cartWithProducts2, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 });
			
			res.jsonp(cartWithProducts2);
		}else{


			
			Product.findById(req.body.productId).populate('photos').exec(function(err,product){
				if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
				if(!product) return res.status(400).send({message:'ไม่พบสินค้าชิ้นนี้'});
				if(req.body.quantity > product.quantity) return res.status(400).send({message:'มีสินค้า <strong>'+product.name+'<strong> ในร้านจำนวน '+product.quantity+' ชิ้นค่ะ'}); 

				cartWithProducts2.push({product:product,quantity:req.body.quantity});

				console.log(cartWithProducts2.length);

				res.cookie('cart',cartWithProducts2, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 });
				res.jsonp(cartWithProducts2);
			});
		}
		
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
 exports.edit = function(req, res) {
 	if(!req.body.productId) return res.status(400).send({message:'กรุณาระบุสินค้าด้วยค่ะ'});
 	if(!req.body.quantity) return res.status(400).send({message:'กรุณาระบบจำนวนสนิค้าด้วยค่ะ'});

 	if(req.user){
 		Customer.findOne({_id:req.user}).populate('cart.product').exec(function(err,customer){
 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			var checkCart = _.findIndex(customer.cart,'product._id',mongoose.Types.ObjectId(req.body.productId));

 			if(req.body.quantity > customer.cart[checkCart].product.quantity)
 				return res.status(400).send({message:'มีสินค้า <strong>'+customer.cart[checkCart].product.name+'<strong> ในร้านจำนวน '+customer.cart[checkCart].product.quantity+' ชิ้นค่ะ'});

 			customer.cart[checkCart].quantity = req.body.quantity;

 			customer.save(function(err,customer){

 				if(err) return res.status(400).send({message:'ลบสินค้าในตะกร้าไม่สำเร็จ กรุณาลองใหม่ค่ะ'});
 				if(customer)
 					res.jsonp(customer.cart);
 			});

 			
 		});
 		
 	}else{
 		var cartWithProducts = req.cookies.cart;
 		var productInCartIndex = _.findIndex(cartWithProducts,'product._id',req.body.productId);

 		if(req.body.quantity > cartWithProducts[productInCartIndex].product.quantity)
 			return res.status(400).send({message:'มีสินค้า <strong>'+cartWithProducts[productInCartIndex].product+'<strong> ในร้านจำนวน '+cartWithProducts[productInCartIndex].product.quantity+' ชิ้นค่ะ'});

 		cartWithProducts[productInCartIndex].quantity = req.body.quantity;

 		res.cookie('cart',cartWithProducts, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 });
 		res.jsonp(cartWithProducts);
 	}
 };

/**
 * Delete an Cart
 */
 exports.delete = function(req, res) {

 	if(!req.params.productId) return res.status(400).send({message:'กรุณาระบุสินค้าด้วยค่ะ'});

 	if(req.user){
 		
 		Customer.findOne({_id:req.user}).exec(function(err,customer){
 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});


 			var checkCart = _.findIndex(customer.cart,'product',mongoose.Types.ObjectId(req.params.productId));
 			customer.cart.splice(checkCart,1);

 			customer.save(function(err,customer){

 				if(err) return res.status(400).send({message:'ลบสินค้าในตะกร้าไม่สำเร็จ กรุณาลองใหม่ค่ะ'});
 				if(customer)
 					res.jsonp(customer.cart);
 			});
 		});
 	}else{
 		var cartWithProducts = req.cookies.cart;
 		var productInCartIndex = _.findIndex(cartWithProducts,'product._id',req.params.productId);

 		cartWithProducts.splice(productInCartIndex,1);


 		res.cookie('cart',cartWithProducts, { path: '/', httpOnly: true, maxAge: 365 * 24 * 60 * 60 });
 		res.jsonp(cartWithProducts);

 	}
 };

/**
 * List of Carts
 */
 exports.list = function(req, res) {
 	if(req.user){
 		Customer.findOne({_id:req.user._id}).lean().populate({path:'cart.product'}).exec(function(err,customer){
 			var options = {
 				path:'cart.product.photos',
 				model:'Photo'
 			};

 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			Customer.populate(customer,options,function(err,customer){
 				res.jsonp(customer.cart);
 			});
 			
 		});
 	}else{
 		var cartWithProducts = req.cookies.cart;
 		res.jsonp(cartWithProducts);

 	}
 };