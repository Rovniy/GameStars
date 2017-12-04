(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .directive('trackEventByLoad', trackEventByLoad);

    trackEventByLoad.$inject = ['Analytics'];

    /* @ngInject */
    function trackEventByLoad(Analytics) {
        return {
            restrict: 'E',
            scope: {
                trackCategory: '@trackCategory',
                trackAction: '@trackAction',
                trackLabel: '@trackLabel',
                trackParams: '@trackParams'
            },
            controller: ['$scope', controller],
            link: function(scope, element, attrs){

            }
        };

        function controller($scope) {
            Analytics.trackEvent($scope.trackCategory, $scope.trackAction, $scope.trackLabel, $scope.trackParams);
        }
    }

})();

