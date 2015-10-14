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
 Banner = mongoose.model('Banner'),
 errorHandler = require('./errors.server.controller'),
 _ = require('lodash');

 exports.add = function(req,res){

 	
 	
 	var form = new multipart.Form();

 	form.parse(req,function(err,fields,files){
 		
 		if(err) return res.status(400).send(err);
 		
 		var bannerFields = JSON.parse(fields.data[0]);

 		_.forEach(files,function(n,key){
 			var src = n[0].path;
 			var extension = path.extname(n[0].originalFilename);
 			var newFilename = uuid.v1().concat(extension);
 			var dest = './public/banner_images/'.concat(newFilename);
 			var size = n.size;
 			var url = '/banner_images/'+newFilename;

 			
 			//console.log(fields.data[0]['text']);
 			//console.log(fields.data[0].productUrl);

 			fs.move(src,dest,function(err){
 				if(err){
 					return res.status(400).send(err);
 				}else{
 					var banner = new Banner({
 						image:{
 							name:newFilename,
 							extension:extension,
 							size:size,
 							url:url
 						},
 						text:bannerFields.text,
 						productUrl:bannerFields.productUrl,
 						user:req.user
 					});



 					banner.save(function(err){
 						if(err){
 							return res.status(400).send({
 								message:errorHandler.getErrorMessage(err)
 							});
 						}else{
 							res.json(banner);

 						}
 					});

 				} 				

 			});

 		});

 	});


 	/*var banner = new Banner(req.body);

 	banner.save(function(err,banner){
 		if(err) res.status(400).send({message:errorHandler.getErrorMessage(err)});

 		res.jsonp(banner);
 	});*/

};


exports.edit = function(req,res){

};

exports.remove = function(req,res){
	var banner = req.banner;

	banner.remove(function(err){
		if(err){
			return res.status(400).send({message:errorHandler.getErrorMessage(err)});
		}else{
			
			var bannerRemove = './public'.concat(banner.image.url);

			fs.remove(bannerRemove, function (err) {
 				if (err) throw err;
 				res.end();
 			});
		}
	});

};

exports.list = function(req,res){
	Banner.find().sort('-created').exec(function(err,banners){
		if(err)
			res.status(400).send(err);

		res.jsonp(banners);
	});
};

exports.bannerById = function(req,res,next,id){
	Banner.findById(id,function(err,banner){
		if(err) return next(err);
		if(!banner) return next(new Error('Failed to load banner'+id));

		req.banner = banner;

		next();
	});
};