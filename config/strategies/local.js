'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {

				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'email หรือ password ไม่ถูกต้อง'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'email หรือ password ไม่ถูกต้อง'
					});
				}

				return done(null, user);
			});
		}
	));
};