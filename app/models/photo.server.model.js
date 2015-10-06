'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Photo Schema
 */
 var PhotoSchema = new Schema({
 	name:{
 		type:String
 	},
 	extension:{
 		type:String
 	},
 	size:{
 		type:Number
 	},
 	url:{
 		type:String
 	},
 	user:{
 		type:Schema.ObjectId,
 		ref:'User'
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	},
 });

 mongoose.model('Photo', PhotoSchema);