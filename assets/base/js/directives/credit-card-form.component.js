(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .component('gsCreditCardForm', {
            controller: Controller,
            templateUrl: '/src/html/templates/credit-card-form.view.html',
            bindings: {
                amount: '<',
                onSubmit: '&',
                onSuccess: '&',
                onFailed: '&'
            }
        });

    Controller.$inject = [];

    /* @ngInject */
    /**
     * @property {number} amount
     * @property {function} onSubmit
     * @property {function} onSuccess
     * @property {function} onFailed
     * @constructor
     */
    function Controller() {
        var ctrl = this;
        
        ctrl.loading = false;
        ctrl.cardNumber = '';
        ctrl.firstName = '';
        ctrl.lastName = '';
        ctrl.month = '';
        ctrl.year = '';
        ctrl.cvn = '';
        ctrl.error = false;

        ctrl.submit = submit;

        function submit() {
            //TODO: submit

            ctrl.onSubmit();
        }
    }

})();