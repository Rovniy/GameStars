(function () {
    'use strict';

    angular
        .module('gamestar')
        .directive('gsFormatCard', gsFormatCard);

    gsFormatCard.$inject = [];

    /* @ngInject */
    function gsFormatCard() {
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        /**
         *
         * @param scope
         * @param element
         * @param attrs
         * @param {angular.INgModelController} ngModel
         */
        function link(scope, element, attrs, ngModel) {
            // ngModel.$formatters.unshift(function (value) {
            //     console.log('value: ' + value);
            //     return value;
            // });


            ngModel.$parsers.unshift(function (viewValue) {
                if (viewValue) {
                    var formatted = viewValue.match(/.{1,4}/g);
                    formatted = formatted.join(' ');
                    // viewValue = viewValue.split('').join(' ');
                    ngModel.$setViewValue(formatted);
                    ngModel.$render();
                }

                return viewValue;
            });
        }
    }

})();