'use strict';

module.exports = {
	db: 'mongodb://localhost/gadgetboy-dev',
	app: {
		title: 'gadgetboy - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '750701491722559',
		clientSecret: process.env.FACEBOOK_SECRET || '0678f654f3f4e001fea07e3af7e53d44',
		callbackURL: '/api/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'Gadgetboy',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'gadgetboy.shop@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'gadmusiclift3089'
			}
		}
	}
};
