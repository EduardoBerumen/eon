'use strict';

// Tareas controller
angular.module('tareas').controller('TareasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tareas', 'ngTableParams',
	function($scope, $stateParams, $location, Authentication, Tareas, ngTableParams) {
		$scope.authentication = Authentication;

		var params = {
			page: 1,
			count: 5
		};

		var settings = {
			total: 0,
			counts: [5,10,15],
			getData: function($defer, params){
				Tareas.get(params.url(), function(response){
					params.total(response.total);
					$defer.resolve(response.results);
				});
			}
		};

		$scope.tableParams = new ngTableParams(params, settings);

		
		// Create new Tarea
		$scope.create = function() {
			// Create new Tarea object
			var tarea = new Tareas ({
				name: this.name,
				prioridad: this.prioridad
			});

			// Redirect after save
			tarea.$save(function(response) {
				$location.path('tareas/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.prioridad = 'PLANIFICADA';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tarea
		$scope.remove = function(tarea) {
			if ( tarea ) { 
				tarea.$remove();

				for (var i in $scope.tarea) {
					if ($scope.tareas [i] === tarea) {
						$scope.tareas.splice(i, 1);
					}
				}
			} else {
				$scope.tarea.$remove(function() {
					$location.path('tareas');
				});
			}
		};

		// Update existing Tarea
		$scope.update = function() {
			var tarea = $scope.tarea;

			tarea.$update(function() {
				$location.path('tareas/' + tarea._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tareas
		$scope.find = function() {
			$scope.tareas = Tareas.query();
		};

		// Find existing Tarea
		$scope.findOne = function() {
			$scope.tarea = Tareas.get({ 
				tareaId: $stateParams.tareaId
			});
		};
	}
]);