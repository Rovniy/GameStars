(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('WithdrawalModalController', WithdrawalModalController);

    WithdrawalModalController.$inject = ['$uibModalInstance', 'modalData', 'userService'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param modalData
     * @param {userService} userService
     * @constructor
     */
    function WithdrawalModalController($uibModalInstance, modalData, userService) {
        var vm = this;
        var userId = modalData.userId;

        vm.loading = false;
        vm.amount = undefined;
        vm.max = undefined;
        vm.error = undefined;

        vm.submit = submit;

        activate();

        ////////////////

        function activate() {
            userService
                .getWithdrawInfo(userId)
                .then(function (data) {
                    vm.max = data.available / 100;
                })
        }

        function submit() {
            var amount = vm.amount * 100;

            vm.loading = true;

            userService
                .withdraw(userId, amount)
                .then(function () {
                    $uibModalInstance.close();
                })
                .catch(function (response) {
                    vm.error = JSON.stringify(response.data.error);
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
    }

})();

