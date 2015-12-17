'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose');
 var async = require('async');
 var _ = require('lodash');
 var multipart = require('multiparty');
 var fs = require('fs-extra');
 var uuid = require('uuid');
 var path = require('path');
 var url = require('url');

 var errorHandler = require('./errors.server.controller');
 var Customer = mongoose.model('Customer');
 var Product = mongoose.model('Product');
 var Photo = mongoose.model('Photo');





 exports.add = function(req, res) {

 	if(!req.body.order) {
 		return res.status(400).send({ message: 'กรุณระบุข้อมูลรายการคำสั่งซื้อค่ะ' });
 	}

 	var order = req.body.order;

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

 			order.code = code;
 			order.products = customer.cart;

 			if(!customer.addresses[0]){
 				customer.addresses.set(0, order.address);
 			}
 			
 			// Check product quantity in stock
 			Product
 			.find({ _id: { $in: _.map(order.products, function(obj){ return obj.product; }) } })
 			.exec(function(err, products) {
 				
 				if(err) {
 					return res.status(400).send({message:'การสั่งซื้อผิดพลาด กรุณาลองใหม่ค่ะ'});
 				}

 				if(!products.length) {
 					return res.status(400).send({message:'การสั่งซื้อผิดพลาด กรุณาลองใหม่ค่ะ'});
 				}

 				
 				products.forEach(function(val, key) {
 					var index = _.findIndex(order.products, 'product', val._id );

 					if(index < 0) {
 						return res.status(400).send({message:'การสั่งซื้อผิดพลาด กรุณาลองใหม่ค่ะ'});
 					}

 					if(val.quantity < order.products[index].quantity) {
 						return res.status(400).send({message:'สินค้า'+ val.name + 'มีเพียงจำนวน' + val.quantity + 'ชิ้น กรุณาแก้ไขจำนวนสินค้าด้วยค่ะ'});
 					}

 					
 					if(key === products.length - 1) {
 						return done(err, customer);
 					}
 					
 				});

 				
 			});
 			
 		}, function(customer, done) {
 			customer.orders.unshift(order);
 			customer.cart = [];

 			customer.save(function(err) {
 				if(err){
 					return done(err);	
 				}

 				var opt = { path: 'products.product', model: 'Product' };

 				Customer.populate(customer.orders[0], opt, function(err, order) {
 					if(err) {
 						return done(err);
 					}

 					var opt = { path: 'products.product.photos', model: 'Photo' };

 					Customer.populate(order, opt, function(err, order) {
 						if(err) {
 							return done(err);
 						}

 						if(!order) {
 							return res.status(400).send({message:'การสั่งซื้อผิดพลาด กรุณาลองใหม่ค่ะ'});
 						}

 						order.cust_id = customer._id;
 						
 						return res.jsonp(order);

 					});
 				});
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
	.unwind('orders.products')
	.group({
		_id: '$orders._id',
		code: { $first: '$orders.code' },
		totalPrice: { $first: '$orders.totalPrice' },
		netTotalPrice: { $first: '$orders.netTotalPrice' },
		status: { $first: '$orders.status' },
		products: { $push: '$orders.products' },
		totalProductQty: { $sum: '$orders.products.quantity'},
		address: { $first: '$orders.address'},
		payment: { $first: '$orders.payment'},
		shipping: { $first: '$orders.shipping'},
		user: { $first: '$user' },
		cust_id: { $first: '$_id' },
		created: { $first: '$orders.created' }
	})
	.exec(function(err, orders) {
		if(err) {
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
	.unwind('orders.products')
	.group({
		_id: '$orders._id',
		code: { $first: '$orders.code' },
		totalPrice: { $first: '$orders.totalPrice' },
		netTotalPrice: { $first: '$orders.netTotalPrice' },
		status: { $first: '$orders.status' },
		products: { $push: '$orders.products' },
		totalProductQty: { $sum: '$orders.products.quantity'},
		address: { $first: '$orders.address'},
		payment: { $first: '$orders.payment'},
		shipping: { $first: '$orders.shipping'},
		user: { $first: '$user' },
		cust_id: { $first: '$_id' },
		created: { $first: '$orders.created' }
	})
	.sort('-created')
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

			var opts = { path: 'products.product.photos', model: 'Photo' };

			Customer.populate(orders, opts, function(err, orders){
				if(err) {
					return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
				}

				return res.jsonp(orders);
			});
		});
		
	});
};

exports.listByUser = function(req, res) {
	var itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
	var currentPage = ((parseInt(req.query.currentPage) || 1) - 1) * itemsPerPage;

	//.match({ 'orders.status': req.query.status || { $in: ['new','confirmed','paid','delivered','completed','overtime','canceled'] } })
	Customer.aggregate()
	.match({ user: req.user._id })
	.unwind('orders')
	.unwind('orders.products')
	.group({
		_id: '$orders._id',
		code: { $first: '$orders.code' },
		totalPrice: { $first: '$orders.totalPrice' },
		netTotalPrice: { $first: '$orders.netTotalPrice' },
		status: { $first: '$orders.status' },
		products: { $push: '$orders.products' },
		totalProductQty: { $sum: '$orders.products.quantity'},
		address: { $first: '$orders.address'},
		payment: { $first: '$orders.payment'},
		shipping: { $first: '$orders.shipping'},
		user: { $first: '$user' },
		cust_id: { $first: '$_id' },
		created: { $first: '$orders.created' }
	})
	.sort('-created')
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

			var opts = { path: 'products.product.photos', model: 'Photo' };

			Customer.populate(orders, opts, function(err, orders){
				if(err) {
					return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
				}

				return res.jsonp(orders);
			});
		});	
	});
};

exports.update = function(req, res) {

	if(!req.body) {
		return res.status(400).send({ message: 'กรุณาระบุรายการสินค้าด้วยค่ะ' });
	}

	var order = req.body;
	
	Customer.update({ 
		user: order.cust_id, 
		'orders._id': req.params.orderId 
	}, { 
		$set: {
			'orders.$.address': order.address,
			'orders.$.status': order.status
		} 
	}).exec(function(err) {
		if(err) {
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}

		res.jsonp(order);
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

		res.jsonp({ count: count });
	});
};


exports.confirmPaid = function(req, res) {
	
	var form = new multipart.Form({
		autoFiles: true,
	});

	form.parse(req, function(err, fields, files) {
		if(err) {
			return res.status(400).send({ 
				message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
			});
		}

		if(!files.file || !files.file.length) {
			return res.status(400).send({ 
				message: 'กรุณาแนบรูป slip ชำระเงินด้วยค่ะ' 
			});
		}


		if(!fields.orderId) {
			return res.status(400).send({ 
				message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
			});
		}

		if(!fields.cost) {
			return res.status(400).send({ 
				message: 'กรุณาระบุจำนวนเงินที่ชำระด้วยค่ะ' 
			});
		}

		if(!fields.paidTime) {
			return res.status(400).send({ 
				message: 'กรุณาระบุวัน-เวลาที่ชำระด้วยค่ะ' 
			});
		}

		var paidEvidence = {
			cost: parseInt(fields.cost),
			paidTime: new Date(String(fields.paidTime)),
			message: String(fields.message) || ''
		};
		var orderId = mongoose.Types.ObjectId(String(fields.orderId));
		var photo = files.file[0];
		var extension = path.extname(photo.originalFilename);
		var newFilename = uuid.v4().concat(extension);
		var oldPath = photo.path;
		var newPath = './public/photos_upload/'+ newFilename;
		var newPhotoUrl = '/photos_upload/' + newFilename;

		fs.rename(oldPath, newPath, function(err){
			if(err) {
				return res.status(400).send({ 
					message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
				});
			}

			var newPhoto = new Photo({ 
				name: newFilename, 
				extension: extension, 
				size: photo.size,
				url: newPhotoUrl,
				user: req.user
			});

			newPhoto.save(function(err) {
				if(err){
					return res.status(400).send({ 
						message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
					});
				}

				paidEvidence.photo = newPhoto;
				
				Customer
				.update({
					user: req.user._id,
					'orders._id': orderId
				},{
					$set: { 'orders.$.paidEvidence': paidEvidence }
				})
				.exec(function(err, result) {
					if(err){
						return res.status(400).send({ 
							message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
						});
					}

					Customer.findOrderById(orderId, function(err, order) {
						if(err) {
							return res.status(400).send({ 
								message: 'แจ้งการชำระเงินผิดพลาดกรุณาลองใหม่ค่ะ' 
							});
						}
						console.log(order);
						res.jsonp(order);
					});
				});		

			});
		});
});
};
