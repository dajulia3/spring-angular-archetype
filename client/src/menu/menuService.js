angular.module('restaurant.menu').service('menuService', function ($http) {
    this.get = function () {
        return $http.get('/menu');
    };
});
