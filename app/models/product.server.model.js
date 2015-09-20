'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Product Schema
 */
 var ProductSchema = new Schema({
 	name:{
 		type:String,
 		required:'Name cannot be blank'
 	},
 	model:{
 		type:String,
 		default:''
 	},
 	brand:{
 		type:String,
 		default:''
 	},
 	color:{
 		type:String
 	},
 	price:{
 		type:Number
 	},
 	sale:{
 		salePrice:{
 			type:Number
 		},
 		onSale:{
 			type:Boolean,
 			default:false
 		}
 	},
 	quantity:{
 		type:Number
 	},
 	shortDescription:{
 		type:String,
 		default:''
 	},
 	description:{
 		type:String,
 		default:''
 	},
 	photos:[{
 		type:Schema.ObjectId,
 		ref:'Photo'
 	}],
 	tags:{
 		type:[String],
 		index:true
 	},
 	soleOut:{
 		type:Boolean,
 		default:false
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	},
 	update:{
 		type:Date
 	},
 	category:{
 		type:Schema.ObjectId,
 		ref:'Category'
 	},
 	user:{
 		type:Schema.ObjectId,
 		ref:'User'
 	}	
 });

 mongoose.model('Product', ProductSchema);