'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose');
 var errorHandler = require('./errors.server.controller');
 var Customer = mongoose.model('Customer');
 var async = require('async');
 var _ = require('lodash');


 exports.add = function(req, res) {
 	async.waterfall([
 		function(done){
 			Customer.findOne({user: req.user._id}, function(err, customer){
 				done(err, customer);
 			});
 		},
 		function(customer, done){
 			req.body.order.products = customer.cart;
 			customer.addresses.set(0, req.body.address);
 			customer.orders.unshift(req.body.order);
 			
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
 	Customer.findOne({user: req.user._id}).populate('user', 'username displayName email').populate('orders.products').exec(function(err, customer){
 		console.log(customer);
 	});
 };