'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var TokenSchema = new Schema({
	token:{
		type:String
	},
	userId:{
		type:Schema.ObjectId
	}

});

TokenSchema.statics.consume = function(tokenParam,cb){
	var self = this;

	self.findOne({token:tokenParam}).exec(function(err,token){
		
		if(err) return cb(err,null);
		if(!token) return cb(err,null);
		
		self.remove({userId:token.userId},function(err){
			if(err) cb(err,null);
			cb(null,token.userId);
		});
	});
};



mongoose.model('Token',TokenSchema);