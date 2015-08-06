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
 	subCategories:[{
 		name:String,
 		description:{
 			type:String,
 			default:''
 		},
 		created:{
 			type:Date,
 			default:Date.now
 		},
 		updated:{
 			type:Date
 		}
 	}],
 	created:{
 		type:Date,
 		default:Date.now
 	},
 	updated:{
 		type:Date
 	}
 });

 mongoose.model('Category', CategorySchema);