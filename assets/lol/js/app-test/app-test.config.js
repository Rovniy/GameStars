(function () {
    'use strict';

    angular
        .module('gamestar')
        .config(config);

    config.$inject = ['$provide'];

    /* @ngInject */
    /**
     * @param {angular.auto.IProvideService} $provide
     */
    function config($provide) {
        $provide.decorator('$http', decorator);
    }

    decorator.$inject = ['$delegate', 'appTestService'];

    /**
     *
     * @param {angular.IHttpService} $delegate
     * @param {appTestService} appTestService
     * @returns {*}
     */
    function decorator($delegate, appTestService) {
        var $http = $delegate;
        var originalGet = $http.get;

        $http.get = function (url, config) {
            if (appTestService.hasTestResponse(url)){
                return appTestService.getTestResponse(url);
            }

            return originalGet.apply($http, arguments);
        };

        return $http;
    }

})();