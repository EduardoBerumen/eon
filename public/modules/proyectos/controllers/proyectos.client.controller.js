'use strict';

// Proyectos controller
angular.module('proyectos').controller('ProyectosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proyectos', 'ngTableParams',
	function($scope, $stateParams, $location, Authentication, Proyectos, ngTableParams) {
		$scope.authentication = Authentication;

		var params = {
			page: 1,
			count: 5
		};

		var settings = {
			total: 0,
			counts: [5,10,15],
			getData: function($defer, params){
				Proyectos.get(params.url(), function(response){
					params.total(response.total);
					$defer.resolve(response.results);
				});
			}
		};

		$scope.tableParams = new ngTableParams(params, settings);

		// Create new Proyecto
		$scope.create = function() {
			// Create new Proyecto object
			var proyecto = new Proyectos ({
				name: this.name,
				descripcion: this.descripcion
			});

			// Redirect after save
			proyecto.$save(function(response) {
				$location.path('proyectos/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.descripcion = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proyecto
		$scope.remove = function(proyecto) {
			if ( proyecto ) { 
				proyecto.$remove();

				for (var i in $scope.proyectos) {
					if ($scope.proyectos [i] === proyecto) {
						$scope.proyectos.splice(i, 1);
					}
				}
			} else {
				$scope.proyecto.$remove(function() {
					$location.path('proyectos/create');
				});
			}
		};

		// Update existing Proyecto
		$scope.update = function() {
			var proyecto = $scope.proyecto;

			proyecto.$update(function() {
				$location.path('proyectos/' + proyecto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proyectos
		$scope.find = function() {
			$scope.proyectos = Proyectos.query();
		};

		// Find existing Proyecto
		$scope.findOne = function() {
			$scope.proyecto = Proyectos.get({ 
				proyectoId: $stateParams.proyectoId
			});
		};
	}
]);