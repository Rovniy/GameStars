(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .factory('smoothScrollToService', smoothScrollToService)
        .directive('smoothScrollTo', smoothScrollTo);

    smoothScrollToService.$inject = ['$window', '$timeout'];

    function smoothScrollToService($window, $timeout) {
        return {
            scrollTo: function(newHash) {

                var startY = $window.pageYOffset,
                    stopY = elementYPosition(newHash),
                    distance = stopY - startY,
                    step = Math.round(distance / 25),
                    stepTransitionTime = Math.abs(Math.round(distance / 100)),
                    startLeapY = startY,
                    leapY = startY + step,
                    counter = 0;

                while (Math.abs(stopY - leapY) >= Math.abs(step)) {
                    leapY += step;
                    startLeapY = leapY;
                    counter++;
                    stepScrollTo(startLeapY, leapY, counter*stepTransitionTime);
                }

                function stepScrollTo(startLeapY, leapY, transitionTime) {
                    $timeout(function () {
                        $window.scrollTo(startLeapY, leapY);
                    }, transitionTime);
                }

                function elementYPosition(newHash) {
                    var element = document.getElementById(newHash),
                        y = element.offsetTop,
                        node = element;

                    while (node.offsetParent && node.offsetParent != document.body) {
                        node = node.offsetParent;
                        y += node.offsetTop;
                    }

                    return y;
                }
            }
        };
    }

    smoothScrollTo.$inject = ['$location', 'smoothScrollToService'];

    function smoothScrollTo($location, smoothScrollToService) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function (evt) {
                    $location.hash(attrs.smoothScrollTo);
                    smoothScrollToService.scrollTo(attrs.smoothScrollTo);
                });

            }
        };
    }

})();