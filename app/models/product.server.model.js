'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 random = require('mongoose-random'),
 Schema = mongoose.Schema;



/**
 * Product Schema
 */
 var ProductSchema = new Schema({
 	name:{
 		type:String,
 		required:'Name cannot be blank',
 		trim:true,
 		index:true
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
 		type:Number,
 		default:0
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
 		type:Number,
 		default:0
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
 	slug:{
 		type:String,
 		trim:true,
 		required:true,
 		index:{unique:true}
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


ProductSchema.plugin(random, { path: 'r' });

mongoose.model('Product', ProductSchema);