'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 random = require('mongoose-random'),
 Schema = mongoose.Schema,
 slug = require('slug');

/**
 * Product Schema
 */
 var ProductSchema = new Schema({
 	name:{
 		type:String,
 		required:'Name cannot be blank',
 		trim:true
 	},
 	models:{
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
 		default:'',
 		trim:true
 	},
 	description:{
 		type:String,
 		default:'',
 		trim:true
 	},
 	photos:[{
 		type:Schema.ObjectId,
 		ref:'Photo'
 	}],
 	tags:{
 		type:[String]
 	},
 	soleOut:{
 		type:Boolean,
 		default:false
 	},
 	slug:{
 		type:String,
 		trim:true,
 		default:''
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	},
 	update:{
 		type:Date
 	},
 	relatedProducts:[{
 		type:String,
 		ref:'Product'
 	}],
 	category:{
 		type:Schema.ObjectId,
 		ref:'Category'
 	},
 	user:{
 		type:Schema.ObjectId,
 		ref:'User'
 	}	
 });

 ProductSchema.index({name:'text', tags:'text', slug:{unique:true}});

 ProductSchema.pre('save',function(next){
 	var self = this;

 	this.generateSlug(this.name,function(slug){
 		self.slug = slug;

 		next();
 	});
 	
 });

 ProductSchema.methods.generateSlug = function (name,cb) {
 	var slugName = slug(name,{lower:true});

 	this.model('Product').find({_id:{$ne:this._id},name:name}).exec(function(err,products){
 		if(err) return cb(slugName);

 		if(products.length){		
 			return cb(slugName+'-'+(products.length+1));
 		}

 		cb(slugName);

 	});
 };


 ProductSchema.plugin(random, { path: 'r' });

 mongoose.model('Product', ProductSchema);