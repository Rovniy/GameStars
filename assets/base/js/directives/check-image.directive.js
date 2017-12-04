(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .directive('checkImage', checkImage);

    checkImage.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     * @returns {{link: link, restrict: string}}
     */
    function checkImage($http) {
        var defaultSrc = '/src/img/tournaments/lol/1.png';
        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                if (!ngSrc) {
                    return;
                }

                $http
                    .get(ngSrc)
                    .catch(function(){
                        element.attr('src', defaultSrc); // set default image
                    });
            });
        }
    }

})();