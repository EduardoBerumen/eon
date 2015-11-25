'use strict';

// Configuring the Articles module
angular.module('tareas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tareas', 'tareas', 'dropdown', '/tareas(/create)?');
		/*Menus.addSubMenuItem('topbar', 'tareas', 'Listado de Tareas', 'tareas');*/
		Menus.addSubMenuItem('topbar', 'tareas', 'Nueva Tarea', 'tareas/create');
	}
]);