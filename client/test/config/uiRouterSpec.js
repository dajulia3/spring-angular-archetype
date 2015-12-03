describe('uiRouter', function () {

    var $state;
    var $location;
    var $rootScope;
    var $templateCache;

    beforeEach(module('restaurant'));

    beforeEach(inject(function (_$state_, _$location_, _$rootScope_, _$templateCache_) {
        $state = _$state_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;

        $templateCache.put('index.html', '');
        $templateCache.put('menu/menu.html', '');
    }));

    it('routes the home state', function () {
        navigateTo('/home');
        expect($state.current.name).toEqual('home');
    });

    it('routes the menu state', function () {
        navigateTo('/menu');
        expect($state.current.name).toEqual('menu');
    });

    it('routes user to home page without specific url', function () {
        navigateTo('/somethingElse');
        expect($state.current.name).toEqual('home');
    });

    function navigateTo(url) {
        $location.url(url);
        $rootScope.$digest();
    }
});
