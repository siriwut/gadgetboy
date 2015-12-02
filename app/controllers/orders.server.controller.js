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

 		}, function(customer, code, done){

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
 	.project({ orders: 1, user: 1 })
 	.unwind('orders')
 	.match({ 'orders._id': orderId })
 	.exec(function(err, customers) {
 		if(err) {
 			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 		}

 		if(!customers.length) {
 			return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 		}

 		var customer = customers[0];

 		var opts = [
 		{ path: 'orders.products.product', model: 'Product' },
 		{ path: 'user', select: 'username email firstName lastName provider', model: 'User' }
 		];

 		Customer.populate(customer, opts, function(err, customers) {
 			if(err) {
 				console.log(err);
 				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 			}

 			if(!customers) {
 				return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 			}

 			var opts = [{ path: 'orders.products.product.photos', model: 'Photo' }];

 			Customer.populate(customers, opts, function(err, customers) {
 				if(err) {
 					console.log(err);
 					return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
 				}

 				if(!customers) {
 					return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 				}

 				res.jsonp(customers);
 			});
 		});
 	});
};


exports.list = function(req, res) {
	var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
	var currentPage = ((parseInt(req.query.currentPage) || 1) - 1) * itemsPerPage;

	Customer.aggregate()
	.project({ orders: 1, user: 1 })
	.unwind('orders')
	.match({ 'orders.status': req.query.status || { $in: ['new','confirmed','paid','delivered','completed','overtime','canceled'] } })
	.sort('-orders.created')
	.skip(currentPage)	
	.limit(itemsPerPage)	
	.exec(function(err, customers) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}

		var opts = [
		{ path: 'orders.products.product', model: 'Product' },
		{ path: 'user', select: 'username email firstName lastName', model: 'User' }
		];

		Customer.populate(customers, opts, function(err, customers) {
			if(err) {
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			}

			return res.jsonp(customers);
		});
	});
};

exports.update = function(req, res) {

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