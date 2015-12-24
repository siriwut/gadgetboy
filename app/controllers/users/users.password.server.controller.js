'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {

	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by username
		function(token, done) {

			if (req.body.username) {
				User.findOne({
					username: req.body.username
				}, '-salt -password', function(err, user) {
					if (!user) {
						return res.status(400).send({
							message: 'ไม่มีชื่อผู้ใช้นี้อยู่ในระบบ'
						});
					} else if (user.provider !== 'local') {
						return res.status(400).send({
							message: 'คุณได้สมัครสมาชิกด้วยบัญชี ' + user.provider + ' แล้ว'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'กรุณากรอก Email ด้วยค่ะ'
				});
			}
		},
		function(token, user, done) {
			res.render('templates/reset-password-email', {
				name: user.displayName,
				appName: config.app.title,
				url: 'http://' + req.headers.host + '/api/auth/reset/' + token
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'กู้คืนรหัสผ่าน (Password)',
				html: emailHTML
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (!err) {
					res.send({
						message: 'Email สำหรับกู้คืนรหัสผ่านได้ส่งไปที่  ' + user.email + ' เรียบร้อยแล้ว กรุณาตรวจสอบ Email ด้วยค่ะ'
					});
				}
				done(err);
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Return authenticated user 
										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'รหัสผ่านไม่ตรงกัน'
						});
					}
				} else {
					return res.status(400).send({
						message: 'token สำหรับรีเซ็ตรหัสผ่านหมดอายุ'
					});
				}
			});
		},
		function(user, done) {
			res.render('templates/reset-password-confirm-email', {
				name: user.displayName,
				appName: config.app.title
			}, function(err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function(emailHTML, user, done) {
			var smtpTransport = nodemailer.createTransport(config.mailer.options);
			var mailOptions = {
				to: user.email,
				from: config.mailer.from,
				subject: 'รหัสผ่านของคุณเปลี่ยนเรียบร้อยแล้วค่ะ',
				html: emailHTML
			};

			smtpTransport.sendMail(mailOptions, function(err) {
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

							user.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									req.login(user, function(err) {
										if (err) {
											res.status(400).send(err);
										} else {
											res.send({
												message: 'เปลี่ยนรหัสผ่านเรียบร้อย'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'รหัสผ่านไม่ตรงกัน'
							});
						}
					} else {
						res.status(400).send({
							message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
						});
					}
				} else {
					res.status(400).send({
						message: 'ไม่พบชื่อผู้ใช้'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'กรุณากำหนดรหัสผ่านใหม่'
			});
		}
	} else {
		res.status(400).send({
			message: 'ผู้ใช้ไม่ได้เข้าสู่ระบบ'
		});
	}
};