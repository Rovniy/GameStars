(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('JoinTournamentModalController', JoinTournamentModalController);

    JoinTournamentModalController.$inject = ['$filter', '$uibModalInstance', 'modalData'];

    /* @ngInject */
    /**
     * Модалка выбора валюты вступления в турнир
     * @param {angular.IFilterService} $filter
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {{ value: number, currencyType: string, default: boolean }[]} modalData
     * @constructor
     */
    function JoinTournamentModalController($filter, $uibModalInstance, modalData) {
        var vm = this;
        
        vm.buyIn = undefined;
        vm.buyInList = undefined;
        
        vm.getCurrencyDescription = getCurrencyDescription;
        vm.getAmountLabel = getAmountLabel;
        vm.submit = submit;

        activate();

        ////////////////

        function activate() {
            vm.buyInList = modalData;

            for (var i = 0; i < vm.buyInList.length; i++){
                if (vm.buyInList[i].isDefault){
                    vm.buyIn = vm.buyInList[i];
                    break;
                }
            }
        }
        
        function getCurrencyDescription() {
            if (!vm.buyIn){
                return;
            }

            if (vm.buyIn.currencyType === 'REAL_POINTS'){
                return 'TOURNAMENT__JOIN_REAL_POINTS_INFO';
            }

            if (vm.buyIn.currencyType === 'STAR_POINTS'){
                return 'TOURNAMENT__JOIN_STAR_POINTS_INFO';
            }
        }

        function getAmountLabel() {
            if (!vm.buyIn){
                return '';
            }

            return $filter('currencyUnit')(vm.buyIn.value, vm.buyIn.currencyType);
        }
        
        function submit() {
            $uibModalInstance.close(vm.buyIn);
        }
    }

})();