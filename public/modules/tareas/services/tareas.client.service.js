'use strict';

//Tareas service used to communicate Tareas REST endpoints
angular.module('tareas').factory('Tareas', ['$resource',
	function($resource) {
		return $resource('tareas/:tareaId', { tareaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);