'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
 var validateLocalStrategyProperty = function(property) {
 	return ((this.provider !== 'local' && !this.updated) || property.length);
 };

/**
 * A Validation function for local strategy password
 */
 var validateLocalStrategyPassword = function(password) {
 	return (this.provider !== 'local' || (password && password.length >= 6));
 };


/**
 * User Schema
 */
 var UserSchema = new Schema({
 	firstName: {
 		type: String,
 		trim: true,
 		default: '',
 		validate: [validateLocalStrategyProperty, 'กรุณากรอก ชื่อ ด้วยค่ะ']
 	},
 	lastName: {
 		type: String,
 		trim: true,
 		default: '',
 		validate: [validateLocalStrategyProperty, 'กรุณากรอก นามสกุล ด้วยค่ะ']
 	},
 	displayName: {
 		type: String,
 		trim: true
 	},
 	email: {
 		type: String,
 		trim: true,
 		index:{unique:true},
 		default: '',
 		validate: [validateLocalStrategyProperty, 'กรุณากรอก Email ด้วยค่ะ'],
 		match: [/.+\@.+\..+/, 'กรุณากรอก Email ให้ถูกต้องด้วยค่ะ']
 	},
 	username: {
 		type: String,
 		index:{unique:true},
 		required: 'กรุณากรอก Username ให้ถูกต้องด้วยค่ะ',
 		trim: true
 	},
 	password: {
 		type: String,
 		default: '',
 		validate: [validateLocalStrategyPassword, 'กรุณากรอก Password 6 ตัวขึ้นไปด้วยค่ะ']
 	},
 	salt: {
 		type: String
 	},
 	provider: {
 		type: String,
 		required: 'Provider is required'
 	},
 	providerData: {},
 	additionalProvidersData: {},
 	roles: {
 		type: [{
 			type: String,
 			enum: ['user', 'admin']
 		}],
 		default: ['user']
 	},
 	updated: {
 		type: Date
 	},
 	created: {
 		type: Date,
 		default: Date.now
 	},
 	/* For reset password */
 	resetPasswordToken: {
 		type: String
 	},
 	resetPasswordExpires: {
 		type: Date
 	}
 });

/**
 * Hook a pre save method to hash the password
 */
 UserSchema.pre('save', function(next) {
 	if (this.password && this.password.length > 6) {
 		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
 		this.password = this.hashPassword(this.password);
 	}

 	next();
 });

/**
 * Create instance method for hashing a password
 */
 UserSchema.methods.hashPassword = function(password) {
 	if (this.salt && password) {
 		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
 	} else {
 		return password;
 	}
 };

/**
 * Create instance method for authenticating user
 */
 UserSchema.methods.authenticate = function(password) {
 	return this.password === this.hashPassword(password);
 };

/**
 * Find possible not used username
 */
 UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {

 	var _this = this;
 	var possibleUsername = username + (suffix || '');

 	_this.findOne({
 		username: possibleUsername
 	}, function(err, user) {
 		if (!err) {
 			if (!user) {
 				callback(possibleUsername);
 			} else {
 				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
 			}
 		} else {
 			callback(null);
 		}
 	});
 };

 mongoose.model('User', UserSchema);