angular.module('restaurant.menu').service('menuService', function($http) {
    return {
            get: function() {
                return $http.get('/menu');
            }
        };
});
