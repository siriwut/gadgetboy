'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Category Schema
 */
 var CategorySchema = new Schema({
 	name:{
 		type:String,
 		require:'Name cannot be blank'
 	},
 	description:{
 		type:String,
 		default:''
 	},
 	parent:{
 		type:Schema.ObjectId,
 		ref:'Category'
 	},
 	subs:[{
 		type:Schema.ObjectId,
 		ref:'Category'
 	}],
 	slug:{
 		type:String,
 		require:'Slug cannot be blank',
 		index:{unique:true}
 	},
 	created:{
 		type:Date,
 		default:Date.now
 	},
 	updated:{
 		type:Date
 	},
 	user:{
 		type:Schema.ObjectId,
 		ref:'User'
 	}
 });

 mongoose.model('Category', CategorySchema);