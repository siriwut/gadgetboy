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
 	colors:[{
 		color:{
 			type:String,
 			enum:['red','green','blue','yellow','purple','brown','grey','black','white']
 		}
 	}],
 	price:{
 		type:Number,
 		default:0
 	},
 	sale:{
 		value:{
 			type:Number,
 			default:0
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
 		name:String,
 		type:String,
 		size:Number,
 		dimensions:{
 			widht:Number,
 			height:Number
 		},
 		url:String,
 		created:{
 			type:Date,
 			default:Date.now
 		}
 	}],
 	tags:[String],
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