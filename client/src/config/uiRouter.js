angular.module('restaurant').config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "index.html"
        })
        .state('menu', {
            url: "/menu",
            templateUrl: "menu/menu.html"
        });
}]);
