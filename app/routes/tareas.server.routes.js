'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tareas = require('../../app/controllers/tareas.server.controller');

	// Tareas Routes
	app.route('/tareas')
		.get(tareas.list)
		.post(users.requiresLogin, tareas.create);

	app.route('/tareas/:tareaId')
		.get(tareas.read)
		.put(users.requiresLogin, tareas.hasAuthorization, tareas.update)
		.delete(users.requiresLogin, tareas.hasAuthorization, tareas.delete);

	// Finish by binding the Tarea middleware
	app.param('tareaId', tareas.tareaByID);
};
