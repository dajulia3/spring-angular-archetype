describe('menuController', function () {
    var menuController;
    var $q;
    var scope;

    beforeEach(module('restaurant.menu'));

    beforeEach(inject(function ($controller, $rootScope, _$q_) {
        scope = $rootScope.$new();
        $q = _$q_;

        var menuServiceMock = {
            get: function () {
                return $q.when({
                    status: 200,
                    menu: {
                        items: [
                            { name: 'abc' }
                        ]
                    }
                });
            }
        };

        $controller('menuController', {$scope: scope, menuService: menuServiceMock});
    }));

    describe('#getMenu', function () {
        it('gets the menu from menu service', function () {
            scope.getMenu();
            expect(scope.menuItems[0]).toEqual({ name: 'abc' });
        });
    });
});

