(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .directive('validateEmail', validateEmail);

    validateEmail.$inject = [];

    /* @ngInject */
    function validateEmail() {
        var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ngModel && ngModel.$validators.email) {

                // this will overwrite the default Angular email validator
                ngModel.$validators.email = function(modelValue) {
                    return ngModel.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    }

})();