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
 			type: String
 		},
 		address:{
 			type: String
 		},
 		province:{
 			type: String
 		},
 		zipcode:{
 			type :String
 		}
 	}],
 	favourite:[{
 		type: Schema.ObjectId,
 		ref: 'Product'
 	}],
 	orders:[{
 		products: [{ type: Schema.ObjectId, ref:'Product' }],
 		totalPrice: Number,
 		payment: {
 			type: String,
 			enum: ['bkt', 'cod', 'cdc', 'other'],
 			default:'bkt'
 		},
 		shipping:{
 			type: {
 				type: String,
 				enum: ['free', 'cost'],
 				default: 'free'
 			},
 			cost:{
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


 

 mongoose.model('Customer', CustomerSchema);