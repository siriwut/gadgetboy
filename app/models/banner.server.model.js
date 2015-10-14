'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Banner Schema
 */
 var BannerSchema = new Schema({
 	image:{
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
 		}
 	},
 	text:{
 		type:String,
 		default:''
 	},
 	productUrl:{
 		type:String,
 		default:''
 	},
 	user:{
 		type:Schema.ObjectId,
 		ref:'User'
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	}
 });

 mongoose.model('Banner', BannerSchema);