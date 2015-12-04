'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose');
 var async = require('async');
 var _ = require('lodash');

 var errorHandler = require('./errors.server.controller');
 var Customer = mongoose.model('Customer');
 var Product = mongoose.model('Product');



 exports.add = function(req, res) {

 	if(!req.body.order) {
 		return res.status(400).send({ message: 'กรุณระบุข้อมูลรายการคำสั่งซื้อค่ะ' });
 	}

 	async.waterfall([
 		function(done){
 			Customer.findOne({user: req.user._id}, function(err, customer){

 				if(!customer) {
 					return res.status(400).send({ message: 'ไม่พบลูกค้าท่านนี้ในระบบค่ะ' });
 				}

 				done(err, customer);
 			});
 		},
 		function(customer, done){

 			customer.generateOrderCode(function(err, code){
 				done(err, customer, code);
 			});

 		}, function(customer, code, done) {

 			req.body.order.code = code;
 			req.body.order.products = customer.cart;

 			if(!customer.addresses[0]){
 				customer.addresses.set(0, req.body.order.address);
 			}
 			
 			customer.orders.unshift(req.body.order);
 			customer.cart = [];

 			customer.save(function(err) {
 				if(err){
 					return done(err);	
 				}

 				return res.jsonp(customer.orders[0]);
 			});
 		}], 
 		function(err){
 			if(err){
 				return res.status(400).send({message:'การสั่งซื้อผิดพลาด กรุณาลองใหม่ค่ะ'});
 			}
 		});
 };

 exports.read = function(req, res) {

 	var orderId;

 	try {
 		orderId = mongoose.Types.ObjectId(req.params.orderId);
 	} catch(ex) {
 		return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 	}

 	Customer.aggregate()
 	.unwind('orders')
 	.match({ 'orders._id': orderId })
 	.project({
		_id: '$orders._id' ,
		code: '$orders.code',
		products: '$orders.products',
		totalPrice: '$orders.totalPrice',
		netTotalPrice: '$orders.netTotalPrice',
		payment: '$orders.payment',
		shipping: '$orders.shipping',
		status: '$orders.status',
		address: '$orders.address',
		user: 1, 
		cust_id: '$_id',
		created: '$orders.created',
	})
	.limit(1)
 	.exec(function(err, orders) {
 		if(err) {
 			console.log(err);
 			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 		}

 		if(!orders.length) {
 			return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 		}
 		
 		var order = orders[0];

 	
 		var opts = [
 		{ path: 'products.product', model: 'Product' },
 		{ path: 'user', select: 'username email firstName lastName provider', model: 'User' }
 		];

 		Customer.populate(order, opts, function(err, order) {
 			if(err) {
 				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 			}
 		
 			if(!order) {
 				return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 			}

 			var opts = [{ path: 'products.product.photos', model: 'Photo' }];

 			Customer.populate(order, opts, function(err, order) {
 				if(err) {
 					return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 				}

 				if(!order) {
 					return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 				}

 				res.jsonp(order);
 			});
 		});
 	});
};


exports.list = function(req, res) {
	var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
	var currentPage = ((parseInt(req.query.currentPage) || 1) - 1) * itemsPerPage;

	Customer.aggregate()
	.unwind('orders')
	.match({ 'orders.status': req.query.status || { $in: ['new','confirmed','paid','delivered','completed','overtime','canceled'] } })
	.sort('-orders.created')
	.project({
		_id: '$orders._id' ,
		code: '$orders.code',
		products: '$orders.products',
		totalPrice: '$orders.totalPrice',
		netTotalPrice: '$orders.netTotalPrice',
		payment: '$orders.payment',
		shipping: '$orders.shipping',
		status: '$orders.status',
		address: '$orders.address',
		user: 1, 
		cust_id: '$_id',
		created: '$orders.created'
	})
	.skip(currentPage)
	.limit(itemsPerPage)
	.exec(function(err, orders) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		
		var opts = [
		{ path: 'products.product', model: 'Product' },
		{ path: 'user', select: 'username email firstName lastName provider', model: 'User' }
		];

		Customer.populate(orders, opts, function(err, orders) {
			if(err) {
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			}
		
			return res.jsonp(orders);
		});
		
	});
};

exports.update = function(req, res) {

	if(!req.body) {
		return res.status(400).send({ message: 'กรุณาระบุรายการสินค้าด้วยค่ะ' });
	}

	var customer = req.body;
	
	Customer.update({ 
		_id: customer._id, 
		'orders._id': req.params.orderId 
	}, { 
		$set: {
			'orders.$.address': customer.orders.address,
			'orders.$.status': customer.orders.status
		} 
	}).exec(function(err) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}

		res.jsonp(customer);
	});

};

exports.remove = function(req, res) {
	var customerId;
	var orderId;

	try {
		customerId = mongoose.Types.ObjectId(req.params.custId);
		orderId = mongoose.Types.ObjectId(req.params.orderId);
	} catch (ex) {
		return res.status(400).send({ message: errorHandler.getErrorMessage(ex) });
	}

	Customer
	.update({ _id: customerId }, { $pull: { orders: { _id: orderId } } })
	.exec(function(err, result) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}

		res.jsonp(result);
	});
};

exports.count = function(req, res) {
	Customer.countOrdersByStatus(req.query.status || null, function(err, count) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		return res.jsonp({ count: count });
	});
};