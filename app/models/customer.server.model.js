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
 	favourite:[{
 		type: Schema.ObjectId,
 		ref: 'Product'
 	}],
 	orders:[{
 		code: {
 			type: String,
 			default: ''
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


CustomerSchema.index({'orders.code': 'text'});

mongoose.model('Customer', CustomerSchema);