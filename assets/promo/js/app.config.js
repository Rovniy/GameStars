(function () {
    'use strict';

    angular
        .module('gamestar')
        .config(config);

    config.$inject = ['$locationProvider', '$animateProvider', '$httpProvider'];

    /* @ngInject */
    /**
     * @param {angular.ILocationProvider} $locationProvider
     * @param {angular.translate.ITranslateProvider} $translateProvider
     * @param {angular.animate.IAnimateProvider} $animateProvider
     * @param {angular.IHttpProvider} $httpProvider
     * @param envServiceProvider
     */
    function config ($locationProvider, $animateProvider, $httpProvider) {

        $locationProvider.html5Mode(true);

        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);

        $httpProvider.useApplyAsync(true);
    }

})();