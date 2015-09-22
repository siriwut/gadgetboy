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
 		required:'Name cannot be blank',
 		trim:true
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
 	slugName:{
 		type:String,
 		trim:true
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

 ProductSchema.pre('save',function(next){
 	this.createSlugName();
 	next();
 });

 
 ProductSchema.methods.createSlugName = function(){
 	this.slugName = this.name;
 };

 mongoose.model('Product', ProductSchema);