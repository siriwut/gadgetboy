'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose');
 var crypto = require('crypto');
 var async = require('async');
 var _ = require('lodash');

 var errorHandler = require('./errors.server.controller');
 var Customer = mongoose.model('Customer');
 var User = mongoose.model('User');


/**
 * Create a Customer
 */
 exports.create = function(req, res) {
 	var customer = new Customer(req.body);
 	customer.user = req.user;

 	customer.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(customer);
 		}
 	});
 };

/**
 * Show the current Customer
 */
 exports.read = function(req, res) {
 	res.jsonp(req.customer);
 };

/**
 * Update a Customer
 */
 exports.update = function(req, res) {
 	var customer = req.customer ;

 	customer = _.extend(customer , req.body);

 	customer.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(customer);
 		}
 	});
 };

/**
 * Delete an Customer
 */
 exports.delete = function(req, res) {
 	var customer = req.customer;

 	async.waterfall([function(done) {
 		customer.remove(function(err) {
 			done(err, customer);
 		});	
 	}, function(customer, done){
 		customer.user.remove(function(err) {
 			if(err){
 				return done(err);
 			}

 			res.jsonp(customer);
 		});
 	}], function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} 
 	});
 };

/**
 * List of Customers
 */
 exports.list = function(req, res) {
 	async.waterfall([function(done){
 		User.find({ $and: [{ roles: { $eq: 'user' }  }, { roles: { $ne: 'admin' } }] }, function(err, users) {
 			done(err, users);
 		});
 	}, function(users, done) {
 		var ids = _.map(users, function(obj){ return obj._id; });
 		
 		Customer
 		.find({ user: { $in: ids } })
 		.sort('-created')
 		.populate('user', 'displayName username email roles provider')
 		.exec(function(err, customers) {
 			if (err) {
 				return done(err);
 			} 

 			res.jsonp(customers);
 			
 		});
 	}], function(err) {
 		if(err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		}
 	});
};



/**
 * Customer middleware
 */
 exports.customerByID = function(req, res, next, id) { 
 	Customer.findOne({user: id}).populate('user', 'displayName').exec(function(err, customer) {
 		if (err) return next(err);
 		if (!customer) return next(new Error('Failed to load Customer ' + id));
 		req.customer = customer ;
 		next();
 	});
 };

/**
 * Customer authorization middleware
 */
 exports.hasAuthorization = function(req, res, next) {
 	if (req.customer.user.id !== req.user.id) {
 		return res.status(403).send('User is not authorized');
 	}
 	next();
 };
