describe('menuService', function () {
    var menuService;
    var $httpBackend;

    beforeEach(module('restaurant.menu'));

    beforeEach(inject(function (_menuService_, _$httpBackend_) {
        menuService = _menuService_;
        $httpBackend = _$httpBackend_;

        $httpBackend.when('GET', '/menu')
            .respond(200, {'menu': {'items': [{'name': 'apples'}]}});
    }));

    describe('#get', function () {
        it('gets the menu with menu items', function () {
            var actualResponse;
            var expectedResponse = {'menu': {'items': [{'name': 'apples'}]}};
            $httpBackend.expectGET('/menu');

            menuService.get().then(function (response) {
                actualResponse = response;
                $httpBackend.flush();
                expect(actualResponse).toEqual(expectedResponse);
            });
        });
    });
});
