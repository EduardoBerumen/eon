'use strict';

// Tareas controller
angular.module('tareas').controller('TareasController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Tareas', 'ngTableParams',
	function($scope, $http ,$stateParams, $location, Authentication, Tareas, ngTableParams) {
		$scope.authentication = Authentication;


		$scope.usuarios = [];
		$scope.proyectos = [];

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


		$( "#auto" ).keyup(function() {
			console.log($('#auto').val());
		});
		
		// Create new Tarea
		$scope.create = function() {
			// Create new Tarea object
			var tarea = new Tareas ({
				dateLim : this.dateLim,
				dateFin : this.dateFin,
				name: this.name,
				status: this.status,
				prioridad: this.prioridad
			});

			// Redirect after save
			tarea.$save(function(response) {
				$location.path('tareas/' + response._id);

				// Clear form fields
				$scope.dateLim = '';
				$scope.dateFin = '';
				$scope.name = '';
				$scope.status = '';
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
					$location.path('/tareas/create');
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

			/*$http.put('tareas/' +  tarea._id).success(function(response) {
				$scope.tarea = response;
				$location.path('tareas/' + tarea._id);
			}).error(function(response) {
				$scope.error = response.message;
			});*/
		};

		// Find a list of Tareas
		$scope.find = function() {
			$scope.tareas = Tareas.query();
		};

		// Find existing Tarea
		/*$scope.findOne = function() {
			$http.get('tareas/' + $stateParams.tareaId).success(function(response) {
				$scope.tarea = response;
				$scope.dateLim = new Date($scope.tarea.dateLim);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};*/
		$scope.findOne = function() {
			$scope.tarea = Tareas.get({ 
				tareaId: $stateParams.tareaId
			}).$promise.then(function(tarea) {
			    $scope.tarea = tarea;
				$scope.tarea.dateLim = new Date(tarea.dateLim);
				console.log($scope.tarea);
			});
		};

		$scope.listUsuarios = function() {
			$http.get('/users/listUsers').success(function(response) {

				/*angular.forEach(response,function(value,key){
					$scope.usuarios.push(value);
				});
				console.log($scope.usuarios);*/
				$scope.usuarios = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.listUsuarios();

		$scope.listProyectos = function() {
			$http.get('/proyectos/listProyectos').success(function(response) {
				$scope.proyectos = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.listProyectos();
	}
]);