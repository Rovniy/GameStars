(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('ConfirmMyBetOrBan', ConfirmMyBetOrBan);

    ConfirmMyBetOrBan.$inject = ['$uibModalInstance'];

    /* @ngInject */
    /**
     * Контроллер, который срабатывает, когда приходит запрос на подтверждение ставки от пользователя
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @constructor
     */

    function ConfirmMyBetOrBan($uibModalInstance) {
        var vm = this;

        vm.AcceptBet = AcceptBet;
        vm.checkboxRememberAcceptBet = false;

        function AcceptBet() {
            localStorage.removeItem('checkboxRememberAcceptBet');

            if (vm.checkboxRememberAcceptBet) {
                localStorage.setItem('checkboxRememberAcceptBet', true);
            }

            $uibModalInstance.close();
        }
    }

})();

