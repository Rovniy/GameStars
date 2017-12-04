(function () {
    'use strict';

    angular
        .module('gamestar')
        .config(config);

    config.$inject = ['$locationProvider', '$translateProvider', '$animateProvider', '$httpProvider', '$compileProvider', 'envServiceProvider'];

    /* @ngInject */
    /**
     * @param {angular.ILocationProvider} $locationProvider
     * @param {angular.translate.ITranslateProvider} $translateProvider
     * @param {angular.animate.IAnimateProvider} $animateProvider
     * @param {angular.IHttpProvider} $httpProvider
     * @param {angular.ICompileProvider} $compileProvider
     * @param envServiceProvider
     */
    function config($locationProvider, $translateProvider, $animateProvider, $httpProvider, $compileProvider, envServiceProvider) {
        $translateProvider
            .useSanitizeValueStrategy('sanitizeParameters')
            .registerAvailableLanguageKeys(['ru', 'en', 'fr'], {
                'ru*': 'ru',
                'en*': 'en',
                'fr*': 'fr',
                '*': 'en' // must be last!
            })
            .fallbackLanguage('en')
            .determinePreferredLanguage()
            .useLocalStorage()
            .useMissingTranslationHandlerLog();

        envServiceProvider.config({
            domains: {
                local: [
                    'gamestars.local',
                    'lol.gamestars.local'
                ],
                development: [
                    'game-stars.ru',
                    'lol.game-stars.ru',

                    'gamestars.us',
                    'lol.gamestars.us',

                    'onlinekiller.ru',
                    'lol.onlinekiller.ru'
                ],
                production: [
                    'gamestars.gg',
                    'lol.gamestars.gg'
                ]
            },
            vars: {
                local: {
                    apiKeySegment: "LB76ctR1m0R0UemR7ZTpXG4fg59SSd0d"
                },
                development: {
                    apiKeySegment: "LB76ctR1m0R0UemR7ZTpXG4fg59SSd0d"
                    //apiKeyMixpanel: "7ea852677737b5d582e483a1bdfb0d1a",
                },
                production: {
                    apiKeySegment: "RjF8UgBgfFFOGcytk1VT3LumJHUh0ZwR"
                    //apiKeyMixpanel: "063012ea9ec678f1eabee651dc79fd54",
                }
            }
        });

        envServiceProvider.check();

        if (envServiceProvider.get() !== 'local') {
            $compileProvider.debugInfoEnabled(false);
        }

        $locationProvider.html5Mode(true);

        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);

        $httpProvider.useApplyAsync(true);
    }

})();