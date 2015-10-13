'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./shop/shop.catalog.server.controller'),
	require('./shop/shop.wall.server.controller')

);