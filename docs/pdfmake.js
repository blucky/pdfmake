var app = angular.module('pdfmake', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'mainPage.html',
			controller: 'PlaygroundController'
		})
		.when('/features', {
			templateUrl: 'features.html',
		})
		.when('/gettingstarted', {
			templateUrl: 'gettingStarted.html',
		})
		.otherwise({ redirectTo: '/' });
});
