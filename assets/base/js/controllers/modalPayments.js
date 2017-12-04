(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('PaymentsModalController', PaymentsModalController);

    PaymentsModalController.$inject = ['$scope', 'Analytics'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {Analytics} Analytics
     * @constructor
     */
    function PaymentsModalController($scope, Analytics) {
        var vm = this;

        $scope.pending = false;
        $scope.pendingVisa = false;
        $scope.buttonsDisable = false;
        $scope.someMoney = '';
        $scope.showList = false;


        $scope.goPayFromModal = goPayFromModal;
        $scope.checkSomeMoney = checkSomeMoney;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('billing', 'deposit_popup_show', '', {});

            /** AP: Analytics **/
            $scope.$watch('radioXZ', function(newVal, oldVal){

                if(newVal > 0 && newVal !== oldVal){
                    Analytics.trackEvent('billing', 'deposit_popup_amount_selected', '', {
                        amount: newVal
                    });
                }

            });

            /** AP: Analytics **/
            $scope.$watch('payVisa', function(newVal){
                if(newVal == true){
                    Analytics.trackEvent('billing', 'deposit_popup_method_selected', '', {
                        amount: $scope.radioXZ,
                        method: 'visa'
                    });
                }

            });
        }

        // Нажатие на тип отплаты
        function goPayFromModal(provider) {
            /** AP: Analytics **/
            if(provider.type == 'paypal'){
                Analytics.trackEvent('billing', 'deposit_popup_method_selected', '', {
                    amount: $scope.radioXZ,
                    method: provider.type
                });
            }

            Analytics.trackEvent('billing', 'deposit_popup_gopay', '', {
                amount: $scope.radioXZ,
                method: provider.type
            });
        }

        function checkSomeMoney() {
            if ($scope.someMoney/2) {
                $scope.someMoney = Math.round($scope.someMoney);
                if ($scope.someMoney < 2) {
                    $scope.someMoney = 2;
                    $scope.dollars = $scope.someMoney*100;
                    $scope.buttonsDisable = true;
                    $scope.showList = true;
                } else {
                    $scope.dollars = $scope.someMoney*100;
                    $scope.buttonsDisable = true;
                    $scope.showList = true;
                }
            } else {
                $scope.someMoney = '';
            }

        }

    }

})();


