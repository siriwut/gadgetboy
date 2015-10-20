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
 		required:'Name cannot be blank',
 		index:true
 	},
 	description:{
 		type:String,
 		default:''
 	},
 	parent:{
 		type:String,
 		ref:'Category'
 	},
 	subs:[{
 		type:String,
 		ref:'Category'
 	}],
 	slug:{
 		type:String,
 		required:true,
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






 CategorySchema.statics.buildSubs = function(id,parentId,cb){
 	var _this = this;	

 	_this.findOne({_id:parentId}).select({subs:1}).exec(function(err,parent){
 		if(!err){
 			if(!parent) return;

 			parent.subs.push(id);
 			_this.update({_id:parent._id},{$set:{subs:parent.subs}},cb);
 			
 		}else{
 			cb(null);
 		}

 	});
 };

 mongoose.model('Category', CategorySchema);