'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		console.log('ola mundillo');

		var persona1 = {
			nombre : 'Eduardo',
			edad : '23'
		};

		var persona2 = {
			nombre : 'Jorge',
			edad : '23'
		};

		var contactlist = [persona1, persona2];
		$scope.contactlist = contactlist;
	}
]);