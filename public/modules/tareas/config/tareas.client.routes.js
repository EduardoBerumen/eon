'use strict';

//Setting up route
angular.module('tareas').config(['$stateProvider',
	function($stateProvider) {
		// Tareas state routing
		$stateProvider.
		state('listTareas', {
			url: '/tareas',
			templateUrl: 'modules/tareas/views/list-tareas.client.view.html'
		}).
		state('createTarea', {
			url: '/tareas/create',
			templateUrl: 'modules/tareas/views/create-tarea.client.view.html'
		}).
		state('viewTarea', {
			url: '/tareas/:tareaId',
			templateUrl: 'modules/tareas/views/view-tarea.client.view.html'
		}).
		state('editTarea', {
			url: '/tareas/:tareaId/edit',
			templateUrl: 'modules/tareas/views/edit-tarea.client.view.html'
		});
	}
]);