'use strict';



/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 multipart = require('multiparty'),
 fs = require('fs-extra'),
 uuid = require('uuid'),
 path = require('path'),
 url = require('url'),
 _ = require('lodash');

 var mongoose = require('mongoose'),
 Photo = mongoose.model('Photo'),
 errorHandler = require('./errors.server.controller');


/**
 * Create a Photo upload
 */
 exports.create = function(req, res) {
 	var tmp  = './public/tmp/';
 	var form = new multipart.Form({autoFiles:true,uploadDir:tmp});

 	form.parse(req,function(err,fields,files){
 		_.forEach(files,function(n,key){

 			var src = n[0].path;
 			var extension = path.extname(n[0].originalFilename);
 			var newFilename = uuid.v1().concat(extension);
 			var dest = './public/photos_upload/'.concat(newFilename);
 			var size = n.size;
 			var photoUrl = '/photos_upload/'+newFilename;


 			fs.move(src,dest,function(err){
 				if(err){
 					return res.status(400).send({
 						message:errorHandler.getErrorMessage(err)
 					});
 				}else{
 					var photo = new Photo({
 						name:newFilename,
 						extension:extension,
 						size:size,
 						url:photoUrl,
 						user:req.user
 					});

 					photo.save(function(err){
 						if(err){
 							return res.status(400).send({
 								message:errorHandler.getErrorMessage(err)
 							});
 						}else{
 							res.json(photo);

 						}
 					});

 				} 				

 			});

 		});
 	});
 };

/**
 * Show the current Photo upload
 */
 exports.read = function(req, res) {

 };

/**
 * Update a Photo upload
 */
 exports.update = function(req, res) {

 };

/**
 * Delete an Photo upload
 */
 exports.delete = function(req, res) {
 	var photo = req.photo;
 	photo.remove(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			var photoRemove = './public/photos_upload/'.concat(photo.name);
 			fs.remove(photoRemove, function (err) {
 				if (err) return console.error(err);
 				res.json(photo);
 			});
 		}
 	});
 };

/**
 * List of Photo uploads
 */
 exports.list = function(req, res) {

 };

 exports.photoByID = function(req,res,next,id){
 	Photo.findById(id).populate('user').exec(function(err,photo){
 		if(err) return next(err);
 		if(!photo) return next(new Error('Failed to load photo' + id));

 		req.photo = photo;
 		next();

 	});
 };


 exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};




