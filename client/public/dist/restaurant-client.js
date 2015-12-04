angular.module('restaurant', ['restaurant.menu', 'ui.router']);

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

angular.module('restaurant.menu').controller('menuController', function($scope, menuService) {
    $scope.menuItems = {};

    $scope.getMenu = function() {
        menuService.get().then(function(response) {
            if (response.status === 200) {
                $scope.menuItems = response.menu.items;
            }
        });
    };
});

angular.module('restaurant.menu', []);

angular.module('restaurant.menu').service('menuService', function ($http) {
    this.get = function () {
        return $http.get('localhost:8080/menu');
    };
});
