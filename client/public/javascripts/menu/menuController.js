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
