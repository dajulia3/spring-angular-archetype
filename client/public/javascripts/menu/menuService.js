angular.module('restaurant.menu').service('menuService', function ($http) {
    this.get = function () {
        return $http.get('localhost:8080/menu');
    };
});
