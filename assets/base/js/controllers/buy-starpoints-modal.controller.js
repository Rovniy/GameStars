(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('BuyStarpointsModalController', BuyStarpointsModalController);

    BuyStarpointsModalController.$inject = ['$scope', '$uibModalInstance', 'Analytics', 'paymentService', 'modalData'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {Analytics} Analytics
     * @param {paymentService} paymentService
     * @param modalData
     * @constructor
     */
    function BuyStarpointsModalController($scope, $uibModalInstance, Analytics, paymentService, modalData) {
        var vm = this;

        $scope.sp = modalData.sp;
        $scope.pending = false;
        $scope.pendingVisa = false;

        $scope.goPayFromModal = goPayFromModal;
        $scope.goOtherPaymentsMethods = goOtherPaymentsMethods;
        $scope.onSuccess = onSuccess;

        activate();

        ////////////////

        function activate() {
            var spData = paymentService.getShopItems();

            for (var i = 0; i < spData.length; i++) {
                var item = spData[i];

                if (item.starpoints === $scope.sp) {
                    $scope.bonus = item.bonusPercent;
                    $scope.code = item.code;
                    $scope.cost = item.totalCost;
                    break;
                }
            }

            Analytics.trackEvent('billing', 'sp_popup_show', '', {
                amount: $scope.sp,
                bonus: $scope.sp * $scope.bonus
            });

            /** AP: Analytics **/
            $scope.$watch('payVisa', function (newVal) {
                if (newVal == true) {
                    Analytics.trackEvent('billing', 'sp_popup_method_selected', '', {
                        amount: $scope.sp,
                        bonus: $scope.sp * $scope.bonus,
                        method: 'visa'
                    });
                }
            });

            $scope.allSP = $scope.sp + $scope.sp * $scope.bonus;
        }

        // Нажатие на тип отплаты
        function goPayFromModal(provider) {
            /** AP: Analytics **/
            if (provider.type == 'paypal' || provider.type == 'REAL_POINTS') {
                Analytics.trackEvent('billing', 'sp_popup_method_selected', '', {
                    amount: $scope.sp,
                    bonus: $scope.sp * $scope.bonus,
                    method: provider.type
                });
            }

            Analytics.trackEvent('billing', 'sp_popup_gopay', '', {
                amount: $scope.sp,
                bonus: $scope.sp * $scope.bonus,
                method: provider.type
            });

            if (provider.type == 'FAKE_SKRILL' || provider.type == 'FAKE_PSC') {
                $scope.showFakePaymentMethodSorry = true;
            }
        }

        function goOtherPaymentsMethods() {
            Analytics.trackEvent('billing', 'sp_other_methods', '', {
                amount: $scope.sp
            });

            $scope.showFakePaymentMethods = true;
        }

        function onSuccess() {
            $uibModalInstance.close();
        }

    }

})();