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
	} 	
});

mongoose.model('Category', CategorySchema);