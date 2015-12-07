'use strict';

// Tareas controller
angular.module('tareas').controller('TareasController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Tareas', 'ngTableParams',
	function($scope, $http ,$stateParams, $location, Authentication, Tareas, ngTableParams) {
		$scope.authentication = Authentication;


		$scope.usuarios = [];
		$scope.proyectos = [];
		$scope.nombres = [];
		$scope.proyects = [];


		var params = {
			page: 1,
			count: 10
		};

		var settings = {
			total: 0,
			counts: [10,20,30],
			getData: function($defer, params){
				Tareas.get(params.url(), function(response){
					params.total(response.total);
					$defer.resolve(response.results);
				});
			}
		};

		$scope.tableParams = new ngTableParams(params, settings);

		$scope.addUser = function(){
			var val = $( "#usuarios option:selected" ).text();
			var aux = 0;  

			for (var i = 0; i < $scope.nombres.length; i++) {
				if ($scope.nombres[i].name == val){
					aux++;
				}
			};

			if(aux == 0){
				$scope.nombres.push({'name':val});
			}else{
				alert('El usuario ya esta agregado');
			}

		    console.log($scope.nombres);
		};

		$scope.addProyect = function(){
			var val = $( "#proyectos option:selected" ).text();
			var aux = 0;  

			for (var i = 0; i < $scope.proyects.length; i++) {
				if ($scope.proyects[i].name == val){
					aux++;
				}
			};

			if(aux == 0){
				$scope.proyects.push({'name':val});
			}else{
				alert('El proyecto ya esta agregado');
			}

		    console.log($scope.proyects);
		};

		$scope.tagDeleted = function(){
			console.log($scope.nombres);
			console.log($scope.proyects);
		};
		

		// Create new Tarea
		$scope.create = function() {
			// Create new Tarea object
			var tarea = new Tareas ({
				dateLim : this.dateLim,
				dateFin : this.dateFin,
				name: this.name,
				status: this.status,
				prioridad: this.prioridad,
				nombres: this.nombres,
				proyectos: this.proyects
			});

			console.log(tarea);

			// Redirect after save
			tarea.$save(function(response) {
				$location.path('tareas/' + response._id);

				// Clear form fields
				$scope.dateLim = '';
				$scope.dateFin = '';
				$scope.name = '';
				$scope.status = '';
				$scope.prioridad = '';
				$scope.nombres = [];
				$scope.proyects = [];

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

			console.log(tarea);

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
			    console.log($scope.tarea);
				$scope.tarea.dateLim = new Date(tarea.dateLim);
				$scope.tarea.dateFin = new Date(tarea.dateFin);
				$scope.nombres = $scope.tarea.nombres;
				$scope.proyects = $scope.tarea.proyectos;
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