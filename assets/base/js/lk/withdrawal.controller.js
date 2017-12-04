(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('WithdrawalController', WithdrawalController);

    WithdrawalController.$inject = ['$uibModalInstance', '$rootScope', 'paymentService', 'modalData', 'Analytics', 'userProfileService'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {angular.IScope} $scope
     * @param {paymentService} paymentService
     * @param {{maxWithsrow: number}} modalData
     * @param {Analytics} Analytics
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function WithdrawalController($uibModalInstance, $scope, paymentService, modalData, Analytics, userProfileService) {
        var vm = this;

        vm.loading = false;
        vm.withdrowSuccess = false;
        vm.withdrowError = false;
        vm.min = 1000;
        vm.max = modalData.maxWithsrow; // Максимальная сумма для вывода
        vm.amount = vm.max >= vm.min ? vm.max / 100 : undefined;
        vm.bonus = calcBonus(vm.max);
        vm.translationData = {
            bonus: vm.bonus
        };

        vm.goWithdrow = goWithdrow;
        vm.getAmountLabel = getAmountLabel;

        activate();

        ////////////////

        function activate() {
            //TODO: @e.komarov тут что-то не то
            // return $http
            //     .get('/api/referral')
            //     .then(function () {
            //         Analytics.trackEvent('withdrawal', 'click_button', '', {amount: vm.amount});
            //     })
            //     .catch(function () {
            //        
            //     });

            var unsubscripe = $scope.$on('$routeChangeStart', function () {
                console.log('$routeChangeStart');
                $uibModalInstance.dismiss();
                unsubscripe();
            });
        }

        // Функция вывода денег
        function goWithdrow() {
            vm.loading = true;

            paymentService
                .withdrawTransaction(vm.amount)
                .then(function () {
                    vm.withdrowSuccess = true;
                    Analytics.trackEvent('withdrawal', 'success', '', {amount: vm.amount});
                })
                .catch(function () {
                    vm.withdrowError = true;
                    Analytics.trackEvent('withdrawal', 'fail', '', {amount: vm.amount});
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getAmountLabel() {
            if (!angular.isNumber(vm.amount)){
                return '';
            }

            var finalAmount = vm.amount;

            if (vm.amount <= 30){
                finalAmount = vm.amount - vm.amount / 10;
            }


            if (finalAmount % 1 !== 0){
                finalAmount = finalAmount.toFixed(2);
            }

            return '$' + finalAmount;
        }

        /**
         * Вычисление неотмытого бонуса
         * @param {number} max
         * @return {number}
         */
        function calcBonus(max) {
            var balance = userProfileService.getUserRealpointsVip() || 0;
            var bonus = (balance - max) / 100;

            return bonus % 1 === 0 ? bonus : bonus.toFixed(2);
        }
    }

})();


