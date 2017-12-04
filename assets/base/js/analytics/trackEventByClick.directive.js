(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .directive('trackEventByClick', trackEventByClick);

    trackEventByClick.$inject = ['Analytics'];

    /* @ngInject */
    function trackEventByClick(Analytics) {
        return {
            restrict: 'A',
            priority: 100,
            scope: {
                trackCategory: '@trackCategory',
                trackAction: '@trackAction',
                trackLabel: '@trackLabel',
                trackParams: '@trackParams'
            },
            // controller: function($scope){
            //
            // },
            link: function(scope, element, attrs){

                element.bind('click', function(event) {
                    Analytics.trackEvent(scope.trackCategory, scope.trackAction, scope.trackLabel, scope.trackParams);
                });

            }
        };
    }

})();

