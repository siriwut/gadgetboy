'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Photo Schema
 */
 var PhotoSchema = new Schema({
 	name:String,
 	extension:String,
 	size:Number,
 	url:String,
 	user:{type:Schema.ObjectId,ref:'User'}
 });

 mongoose.model('Photo', PhotoSchema);