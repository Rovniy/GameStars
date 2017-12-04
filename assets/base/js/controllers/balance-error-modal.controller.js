(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('BalanceErrorModalController', BalanceErrorModalController);

    BalanceErrorModalController.$inject = ['$uibModalInstance', 'modalData', 'modalService', 'Analytics'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {{bonus: number, count: number, value: number}} modalData
     * @param {modalService} modalService
     * @constructor
     */
    function BalanceErrorModalController($uibModalInstance, modalData, modalService, Analytics) {
        var vm = this;

        vm.youNeed = modalData.value;
        vm.balanceVip = modalData.count;
        vm.balanceBonus = modalData.bonus;

        Analytics.trackEvent('balanceError', 'show', '', modalData);

        vm.openPaymentModal = openPaymentModal;

        ////////////////

        function openPaymentModal() {
            var modalInstance = modalService.openModal('payment.html');

            $uibModalInstance.dismiss(modalInstance);

            return modalInstance;
        }
    }

})();