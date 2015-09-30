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
 	_id:{
 		type: Schema.ObjectId,
 		ref: 'User'
 	},
 	addresses:[{
 		name:{
 			first:{type:String,require:true},
 			last:{type:String,require:true}
 		},
 		address:{type:String,require:true},
 		province:{type:String,require:true},
 		district:{type:String,require:true},
 	}],
 	favourite:[{
 		type:Schema.ObjectId,
 		ref:'Product'
 	}],
 	orders:[{
 		products:[{
 			product:{
 				_id:Schema.ObjectId ,name:{
 				type:String,
 				required:'Name cannot be blank'
 			},
 			model:{
 				type:String
 			},
 			brand:{
 				type:String
 			},
 			color:{
 				type:String
 			},
 			price:{
 				type:Number
 			}},
 			quantity:{type:Number,default:1}
 		}],
 		totalPrice:Number,
 		status:{
 			type:String,
 			enum:['new','confirmed','paid','delivered','completed','overtime','canceled'],
 			default:'new'
 		}
 	}],
 	created: {
 		type: Date,
 		default: Date.now
 	}
 });

 mongoose.model('Customer', CustomerSchema);