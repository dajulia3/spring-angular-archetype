angular.module("menu").run(["$templateCache", function($templateCache) {$templateCache.put("menu/menu.html","<div ng-app=\"menu\" ng-controller=\"menuController\">\n    <p>This is an awesome menu!</p>\n\n    <p>Menu items: </p>\n\n    <div ng-repeat=\"menuItem in menuItems\">\n        {{ menuItem.name }}\n    </div>\n</div>\n");}]);