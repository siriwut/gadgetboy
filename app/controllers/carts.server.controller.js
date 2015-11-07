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


 var addCookieCart, createCartFromCookie, editCookieCart, deleteCookieCart, checkProductExist, mergeCart;

/**
 * Create a Cart
 */
 exports.add = function(req, res) {
 	if(req.user){
 		async.waterfall([function(done){
 			if(req.body.productId){
 				Customer.findOne({user:req.user._id},function(err,customer){
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
 			Customer.findOne({_id:customer._id,cart:{$elemMatch:{product:req.body.productId}}},function(err,customerWithCart){
 				var hasThisProductInCart = customerWithCart? true : false;
 				done(err,hasThisProductInCart,customer);
 			});

 		},function(hasThisProductInCart,customer,done){
 			//check product in stock
 			Product.findById(req.body.productId,function(err,product){
 				done(err,hasThisProductInCart,customer,product);
 			});
 		},function(hasThisProductInCart,customer,product,done){
 			if(product.quantity <= 0)
 				return res.status(400).send({message:'สิน้คา '+product.name+' หมดแล้วค่ะ'});

 			if(!hasThisProductInCart){
 				customer.cart.push({product:req.body.productId,quantity:req.body.quantity});
 				customer.save(function(err,customer){

 					done(err,customer);
 				});

 			}else{

 				var checkCart = _.findIndex(customer.cart,'product',mongoose.Types.ObjectId(req.body.productId));

 				if((req.body.quantity + customer.cart[checkCart].quantity) > product.quantity){	
 					Customer.update({_id:customer._id,'cart.product':req.body.productId},
 						{'$set':{'cart.$.quantity':product.quantity}},function(err,isUpdated){

 							if(isUpdated){
 								Customer.findById(customer._id,function(err,customer){
 									return res.status(400).send({message:'มีสินค้า <strong>'+product.name+'<strong> ในร้านจำนวน '+product.quantity+' ชิ้นค่ะ'});
 								});
 							}	

 						});
 				}else{
 					Customer.update({_id:customer._id,'cart.product':req.body.productId},
 						{'$inc':{'cart.$.quantity':req.body.quantity}},function(err,isUpdated){

 							if(isUpdated){
 								Customer.findById(customer._id,function(err,customer){
 									done(err,customer);
 								});
 							}	

 						});
 				}


 			}
 		},function(customer,done){
 			//find cart with products
 			Customer.findOne({_id:customer._id}).lean().populate({path:'cart.product'}).exec(function(err,customer){
 				var options = {
 					path:'cart.product.photos',
 					model:'Photo'
 				};

 				done(err,customer,options);
 				
 			});


 		}, function(customer,options,done){
 			Customer.populate(customer,options,function(err,customer){
 				if(err) done(err);

 				res.jsonp(customer.cart);
 			});

 		}],function(err){
 			if(err) return res.status(400).send({message:'การเพิ่มสินค้าผิดพลาด กรุณาลองใหม่ค่ะ'});
 		});

}else{
	addCookieCart(req,res);
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
 		Customer.findOne({user:req.user._id}).populate('cart.product').exec(function(err,customer){
 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			var checkCart = _.findIndex(customer.cart,'product._id',mongoose.Types.ObjectId(req.body.productId));

 			if(req.body.quantity > customer.cart[checkCart].product.quantity)
 				return res.status(400).send({message:'มีสินค้า <strong>'+customer.cart[checkCart].product.name+'<strong> ในร้านจำนวน '+customer.cart[checkCart].product.quantity+' ชิ้นค่ะ'});

 			customer.cart[checkCart].quantity = req.body.quantity;

 			customer.save(function(err,customer){

 				if(err)
 					return res.status(400).send({message:'ลบสินค้าในตะกร้าไม่สำเร็จ กรุณาลองใหม่ค่ะ'});
 				if(customer)
 					res.jsonp(customer.cart);
 			});	
 		});
 		
 	} else {
 		editCookieCart(req, res);
 	}
 };

/**
 * Delete an Cart
 */
 exports.delete = function(req, res) {
 	if(!req.params.productId) return res.status(400).send({message:'กรุณาระบุสินค้าด้วยค่ะ'});

 	if(req.user){
 		Customer.findOne({user:req.user._id}).exec(function(err,customer){
 			var checkCart = false;

 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			checkCart = _.findIndex(customer.cart, 'product', mongoose.Types.ObjectId(req.params.productId));
 			customer.cart.splice(checkCart,1);

 			customer.save(function(err,customer){
 				if(err) return res.status(400).send({message:'ลบสินค้าในตะกร้าไม่สำเร็จ กรุณาลองใหม่ค่ะ'});
 				if(customer)
 					res.jsonp(customer.cart);
 			});
 		});
 	}else{
 		deleteCookieCart(req, res);
 	}
 };

/**
 * List of Carts
 */
 exports.list = function(req, res) {
 	if(req.user){
 		Customer.findOne({user:req.user._id}).populate({path:'cart.product'}).exec(function(err,customer){
 			var options = {
 				path:'cart.product.photos',
 				model:'Photo'
 			};

 			if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			checkProductExist(customer);

 			Customer.populate(customer,options,function(err,customer){
 				res.jsonp(customer.cart);
 			});
 		});
 	}else{	
 		if(req.cookies.cart){
 			var cart = req.cookies.cart;

 			Product.find({ '_id': {'$in': _.pluck(cart, 'product') } }).lean().populate('photos').exec(function(err, products){
 				if(err) return res.status(400).send({message:errorHandler.getErrorMessage(err)});
 				
 				var newCart = createCartFromCookie(products, cart, res);
 				
 				res.jsonp(newCart);
 			});
 		}else{
 			res.end();
 		}	
 	}
 };



 exports.getQuantity = function(req, res){
 	var cart = [],
 	totalQuantity = 0;

 	if(req.user){
 		Customer.findOne({user: req.user._id}, function(err, customer){
 			if(err) return res.status(400).send(err);
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});

 			cart = customer.cart;

 			for(var i = 0; i < cart.length ; i++){
 				totalQuantity += cart[i].quantity;
 			}

 			res.jsonp({quantity: totalQuantity});
 		});
 	}else{
 		if(req.cookies.cart){
 			cart = req.cookies.cart;

 			for(var i = 0; i < cart.length ; i++){
 				totalQuantity += cart[i].quantity;
 			}
 		}

 		res.jsonp({quantity: totalQuantity});
 	}

 };


 exports.cartSignin = function(req, res, merge, cb) {

 	if('function' === typeof merge){
 		cb = merge;
 		merge = false;
 	}

 	var cart = [];

 	if(req.cookies.cart && req.user){
 		cart = req.cookies.cart;

 		Customer.findOne({user: req.user._id}, function(err, customer){
 			if(err) return res.status(400).send(err);
 			if(!customer) return res.status(400).send({message:'ไม่พบลูกค้าท่านนี้ในระบบ'});
 			
 			customer.cart = merge? mergeCart(customer.cart, cart): cart;
 			customer.save(function(err){
 				cb(err);
 			});
 		});
 	}else{
 		cb(null);
 	}
 };


 mergeCart = function(cart1, cart2) {
 	var index = -1;

 	for(var i = 0; i < cart2.length; i++){
 		index = _.findIndex(cart1, {product: mongoose.Types.ObjectId(cart2[i].product)});

 		if(index > -1) {
 			cart1[index] = _.extend(cart2[i], cart1[index]);
 		} else {
 			cart1.push(cart2[i]);
 		}
 	}

 	return cart1;
 };


 addCookieCart = function(req, res){
 	var cart = [];
 	var index = -1;
 	var isQuantityOver = false;

 	Product.findById(req.body.productId, function(err, product) {
 		if(err)
 			return res.status(400).send({ message: 'การเพิ่มสินค้าผิดพลาด กรุณาลองใหม่ค่ะ' });
 		if(!product)
 			return res.status(400).send({ message: 'ไม่พบสินค้าที่ระบุค่ะ'});
 		if(product.quantity <= 0)
 			return res.status(400).send({ message: 'สินค้า' + product.name + 'หมดแล้วค่ะ' });

 		if (!req.cookies.cart) {
 			cart = [{ product:req.body.productId, quantity:req.body.quantity }];	
 		} else {
 			cart = req.cookies.cart;
 			index = _.findIndex(cart, { product: req.body.productId });


 			if (index === -1) {
 				//if no this product exist in cart then push new product to cart
 				cart.push({ product: req.body.productId, quantity: req.body.quantity });
 				var newIndex = _.findIndex(cart, { product:req.body.productId });

 				//if quantity added more than product quantity then update quantity
 				if((cart[newIndex].quantity + req.body.quantity) > product.quantity){
 					cart[newIndex].quantity = product.quantity;
 					isQuantityOver = true;
 				}

 			} else {
 				//if there are this product exist in cart
 				cart[index].quantity += req.body.quantity;

 				//if quantity added more than product quantity 
 				if((cart[index].quantity + req.body.quantity) > product.quantity){
 					cart[index].quantity = product.quantity;
 					isQuantityOver = true;
 				}
 			}
 		}

 		res.cookie('cart', cart, { maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true });

 		Product.find({ '_id':{ '$in': _.pluck(cart, 'product') } }).lean().populate('photos').exec(function(err,products) {
 			if(err)
 				return res.status(400).send({ message: 'การเพิ่มสินค้าผิดพลาด กรุณาลองใหม่ค่ะ' });

 			if(isQuantityOver) {		
 				res.status(400).send({ message: 'มีสินค้า <strong>'+product.name+'<strong> ในร้านจำนวน '+product.quantity+' ชิ้นค่ะ' });
 			} else {
 				var newCart = createCartFromCookie(products, cart);

 				res.jsonp(newCart);
 			}
 		});		
 	});
};


editCookieCart = function(req, res){
	var cart = [],
	index = -1;

	if(!req.cookies.cart)
		return res.status(400).send({ message: 'ไม่มีสินค้าในรถเข็น' });

	cart = req.cookies.cart;
	index = _.findIndex(cart, { product: req.body.productId });

	if(index === -1)
		return res.status(400).send({ message: 'ไม่พบสินค้านี้ในรถเข็น' });

	Product.findById(cart[index].product, function(err, product){
		if(err)
			return res.status(400).send({ message: 'การลบสินค้าผิดพลาด กรุณาลองใหม่ค่ะ' });
		if(!product)
			return res.status(400).send({ message: 'ไม่พบสินค้าในตะกร้าค่ะ' });

		if(req.body.quantity > product.quantity)
			return res.status(400).send({message:'มีสินค้า <strong>'+ product.name +'<strong> ในร้านจำนวน '+ product.quantity +' ชิ้นค่ะ'});

		cart[index].quantity = req.body.quantity;
		res.cookie('cart', cart, { maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true });

		Product.find({ _id: { '$in': _.pluck(cart,'product') } }).lean().populate('photos').exec(function(err,products) {
			if(err)
				return res.status(400).send({ message: 'การแก้ไขสินค้าผิดพลาด กรุณาลองใหม่ค่ะ' });

			var newCart = createCartFromCookie(products, cart);

			res.jsonp(newCart);
		});
	});
};

deleteCookieCart = function(req,res) {
	var cart = [],
	index = -1;

	if(!req.cookies.cart)
		return res.status(400).send({ message: 'ไม่มีสินค้าในรถเข็น' });
	
	cart = req.cookies.cart;
	index = _.findIndex(cart, { product: req.params.productId });

	if(index === -1)
		return res.status(400).send({ message: 'ไม่พบสินค้านี้ในรถเข็น' });

	cart.splice(index, 1);
	

	Product.find({ _id: { '$in': _.pluck(cart,'product') } }).lean().populate('photos').exec(function(err,products) {
		if(err)
			return res.status(400).send({ message: 'การลบสินค้าผิดพลาด กรุณาลองใหม่ค่ะ' });

		var newCart = createCartFromCookie(products, cart);

		res.cookie('cart', cart, { maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true });
		res.jsonp(newCart);
	});
};

createCartFromCookie = function(products, cartCookie, res) {
	var cart = [];
	
	for(var i = 0; i < cartCookie.length; i++){
		var product = _.find(products, { _id: mongoose.Types.ObjectId(cartCookie[i].product) });
		
		if(product){
			cart.push({ product: product, quantity: cartCookie[i].quantity });
		} else { 
			cartCookie.splice(i, 1);
			res.cookie('cart', cartCookie, { maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true });
		}
	}


	return cart;
};

checkProductExist = function(customer){
	var isNotExisted = false;

	for(var i = 0; i < customer.cart.length; i++) {
		if(!customer.cart[i].product){
			customer.cart.splice(i, 1);
			isNotExisted = true;
		}
	}

	if(isNotExisted)
		customer.save();
};
