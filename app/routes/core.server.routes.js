'use strict';
// Root routing
var core = require('../../app/controllers/core.server.controller');

module.exports = function(app) {
	app.route('/').get(core.index);
};