(function () {
    'use strict';

    angular
        .module('gsadmin')
        .directive('gsDateToMs', gsDateToMs);

    gsDateToMs.$inject = [];

    /* @ngInject */
    function gsDateToMs() {
        return {
            link: link,
            require: 'ngModel',
            restrict: 'A',
            scope: false,
            priority: 100
        };

        /**
         * @param {angular.IScope} scope
         * @param {angular.IAugmentedJQuery} element
         * @param {angular.IAttributes} attrs
         * @param {angular.INgModelController} ngModel
         */
        function link(scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (value) {
                if (value) {
                    //из миллисекунд в дату с отрезанными секундами и миллисекундами
                    return moment(value).startOf('minute').toDate();
                }

                return value;
            });

            ngModel.$parsers.push(function (viewValue) {
                if (viewValue) {
                    return moment(viewValue).valueOf();
                }

                return viewValue;
            });
        }
    }

})();