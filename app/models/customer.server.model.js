'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Customer Schema
 */
 var CustomerSchema = new Schema({
 	addresses: [{
 		name:{
 			type: String,
 			trim: true
 		},
 		address:{
 			type: String,
 			trim: true
 		},
 		district:{
 			type: String,
 			trim: true
 		},
 		province:{
 			type: String,
 			trim: true
 		},
 		zipcode:{
 			type :String,
 			trim: true
 		},
 		tel: {
 			type :String,
 			trim: true
 		}
 	}],
 	orders:[{
 		code: {
 			type: Number,
 		},
 		products: [{
 			product: {
 				type:Schema.ObjectId,
 				ref:'Product'
 			},
 			quantity:{
 				type:Number,
 				default: 1
 			}
 		}],
 		totalPrice: Number,
 		netTotalPrice: Number,
 		payment: {
 			type: { 
 				type: String,
 				enum: ['bkt', 'cod', 'cdc', 'other'],
 				default:'bkt'
 			},
 			cost: {
 				type: Number,
 				default: 0
 			}
 		},
 		shipping: {
 			type: {
 				type: String,
 				enum: ['free', 'cost'],
 				default: 'free'
 			},
 			cost: {
 				type: Number,
 				default: 0
 			}
 		},
 		status: {
 			type: String,
 			enum: ['new','confirmed','paid','delivered','completed','overtime','canceled'],
 			default:'new'
 		},
 		address: {
 			name:{
 				type: String,
 				trim: true
 			},
 			address:{
 				type: String,
 				trim: true
 			},
 			district:{
 				type: String,
 				trim: true
 			},
 			province:{
 				type: String,
 				trim: true
 			},
 			zipcode:{
 				type :String,
 				trim: true
 			},
 			tel: {
 				type :String,
 				trim: true
 			}
 		},
 		paidEvidence: {
 			cost: {
 				type: Number
 			},
 			message: {
 				type: String
 			},
 			photo: {
 				type: Schema.ObjectId,
 				ref: 'Photo'
 			},
 			paidTime: {
 				type: Date
 			}
 		},
 		created: {
 			type: Date,
 			default: Date.now
 		}
 	}],
 	cart: [{
 		product: {
 			type:Schema.ObjectId,
 			ref:'Product'
 		},
 		quantity:{
 			type:Number,
 			default:1
 		}
 	}],
 	user: {
 		type: Schema.ObjectId,
 		ref:'User'
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	}
 });


CustomerSchema.index({'orders.code': true});


CustomerSchema.methods.generateOrderCode = function(cb) {
	this.model('Customer')
	.aggregate({ $project: { 'orders.code': 1 } })
	.unwind('orders')
	.sort('-orders.code')
	.limit(1)
	.exec(function(err, result) {
		if(err) {
			return cb(err);
		}
		
		var newCode =  result.length ? result[0].orders.code + 1: 1;
		
		return cb(null, newCode);
	});
};


CustomerSchema.statics.countOrdersByStatus = function(status, cb) {
	this.model('Customer')
	.aggregate()
	.unwind('orders')
	.match({ 'orders.status': {$eq: status} || { $in: ['new','confirmed','paid','delivered','completed','overtime','canceled'] } })
	.group({ _id: null, count: { $sum: 1 } })
	.exec(function(err, result) {
		return cb(err, result.length? result[0].count: 0);
	});
};


CustomerSchema.statics.findOrderById = function(id, cb) {
	this.aggregate()
	.unwind('orders')
	.match({ 'orders._id': id })
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
			return cb(err);
		}

		if(!orders || !orders.length) {
			return cb(err);
		}

		cb(null, orders[0]);
	});
};

mongoose.model('Customer', CustomerSchema);