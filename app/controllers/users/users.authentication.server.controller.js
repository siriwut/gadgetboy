'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	cart = require('../carts.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Token = mongoose.model('Token'),
	Customer = mongoose.model('Customer'),
	crypto = require('crypto');
/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;


	// Add missing user fields
	user.username = user.email;
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var customer = new Customer({
				user: user._id
			});

			customer.save(function(err) {
			
				if (err) return res.status(400).send(err);

				// Remove sensitive data before login
				user.password = undefined;
				user.salt = undefined;

				req.login(user, function(err) {
					if (err) {
						return res.status(400).send(err);
					} else {
						cart.cartSignin(req, res, function(err) {
							if (err) return res.status(400).send(err);

							res.clearCookie('cart', {
								path: '/'
							});
							res.json(user);
						});
					}
				});

			});
		}
	});
};



/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			return res.status(400).send(info);
		} else {

			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;


			//create customer if not exist.
			Customer.findOne({
				user: user._id
			}).exec(function(err, customer) {
				if (err) return res.redirect('/#!/signin');

				if (!customer) {
					var newCustomer = new Customer({
						user: user._id
					});
					newCustomer.save(function(err) {
						if (err) return res.redirect('/#!/signin');
					});
				}
			});


			req.login(user, function(err) {
				if (err) {
					return res.status(400).send(err);
				} else {

					if (req.body.rememberMe) {
						crypto.randomBytes(256, function(err, buffer) {
							if (err) return res.status(400).send(err);

							var tokenString = buffer.toString('hex');
							var token = new Token({
								token: tokenString,
								userId: user._id
							});

							token.save(function(err) {
								if (err) return res.status(400).send(err);

								cart.cartSignin(req, res, req.query.page === 'checkout' ? false : true, function(err) {
									if (err) return res.status(400).send(err);

									res.cookie('remember_me', tokenString, {
										path: '/',
										httpOnly: true,
										maxAge: 604800000
									});
									res.clearCookie('cart', {
										path: '/'
									});
									res.json(user);
								});
							});
						});

					} else {

						cart.cartSignin(req, res, req.query.page === 'checkout' ? false : true, function(err) {
							if (err) return res.status(400).send(err);

							res.clearCookie('cart', {
								path: '/'
							});
							res.json(user);
						});
					}
				}
			});

		}

	})(req, res, next);
};


/**
 * Signout
 */
exports.signout = function(req, res) {
	Token.remove({
		token: req.cookies.remember_me
	}, function(err, token) {
		if (err) return res.status(400).send(err);
	});
	res.clearCookie('remember_me');
	req.logout();
	res.redirect('/');
};


exports.facebookSignin = function(req, res, next) {
	passport.authenticate('facebook', {
		scope: ['email'],
		callbackURL: '/api/auth/facebook/callback/' + req.params.page
	})(req, res, next);
};


/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, {
			callbackURL: '/api/auth/facebook/callback/' + req.params.page
		}, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}

			//create customer if not exist.
			Customer.findOne({
				user: user._id
			}).exec(function(err, customer) {
				if (err) return res.redirect('/#!/signin');

				if (!customer) {
					var newCustomer = new Customer({
						user: user._id
					});
					newCustomer.save(function(err) {
						if (err) return res.redirect('/#!/signin');
					});
				}
			});

			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				cart.cartSignin(req, res, req.params.page === 'checkout' ? false : true, function(err) {
					if (err) return res.status(400).send(err);

					res.clearCookie('cart', {
						path: '/'
					});
					return res.redirect(redirectURL || req.params.page === 'checkout' ? '/#!/checkout/step/shippingandpayment' : '/');
				});
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {

	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

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
						res.json(user);
					}
				});
			}
		});
	}
};