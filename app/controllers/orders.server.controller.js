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
 				if(!err){
 					res.jsonp(customer.orders[0]);
 				}

 				done(err);
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
 	} catch(err) {
 		return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 	}

 	Customer.aggregate()
 	.project({orders: 1, _id: 0})
 	.unwind('orders')
 	.match({ 'orders._id': orderId })
 	.exec(function(err, orders) {
 		if(err) {
 			return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 		}

 		if(!(orders || orders.length)) {
 			return res.status(400).send({ message: 'ไม่พบคำสั่งซื้อค่ะ' });
 		}

 		var order = orders[0].orders;

 		Product.find( { 
 			_id: { $in: _.map(order.products, function(obj){ return obj.product; }) } 
 		} )
 		.populate('photos')
 		.exec(function(err, products){
 			if(err) {
 				return res.status(400).send({ message: 'ไม่พบสินค้าในคำสั่งซื้อนี้ค่ะ' });
 			}

 			if(!(products || products.length)) {
 				return res.status(400).send({ message: 'ไม่พบสินค้าในคำสั่งซื้อนี้ค่ะ' });
 			}

 			order.products = _.map(order.products, function(obj) {
 				var elem = _.find(products, { '_id': obj.product });
 				obj.product = elem;

 				return obj;
 			});

 			res.jsonp(order);
 		});
 	});
 };


 exports.list = function(req, res) {
 	Customer.aggregate()
 	.unwind('orders')
 	.match({ 'orders.status': 'new' })
 	.exec(function(err, orders) {
 		res.jsonp(orders);
 	});
 };