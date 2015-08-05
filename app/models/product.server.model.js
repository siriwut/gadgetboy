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
 	colors:[color:{
 		type:{
 			type:String,
 			enum['red','blue','green','yellow','orange','purple','brown','grey','white','black']
 		},
 		default:''
 	}],
 	price:{
 		type:Number,
 		default:0
 	},
 	discount:{
 		type:Number,
 		default:0
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
 	created: {
 		type: Date,
 		default: Date.now
 	},
 	photos:[photo:{type:String}],
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