(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('RebuyTournamentChipsController', RebuyTournamentChipsController);

    RebuyTournamentChipsController.$inject = ['$http', '$uibModalInstance', 'modalService', 'notificationService', 'modalData'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {modalService} modalService
     * @param {notificationService} notificationService
     * @constructor
     */
    function RebuyTournamentChipsController($http, $uibModalInstance, modalService, notificationService, modalData) {
        var vm = this;

        vm.loading = false;
        vm.rebuy = modalData.rebuy;

        vm.rebuyTourChips = rebuyTourChips;

        activate();

        ////////////////

        function activate() {

        }

        function rebuyTourChips() {
            var type = vm.rebuy.rebuyType === 'ADDON' ? 'addon' : 'rebuy';
            var url = '/api/tournament/' + modalData.tournamentId + '/buy/' + type;
            vm.loading = true;

            return $http
                .post(url, {})
                .then(function (){
                    $uibModalInstance.close();
                    notificationService.success('EXCHANGE_SP__PURCHASE_COMPLETED');
                })
                .catch(function (response) {
                    $uibModalInstance.dismiss();

                    switch (response.data.error.type){
                        case 'StackMoreThenMinBlindException':
                            modalService.openTextModal('EXCHANGE_SP__PURCHASE_SACKBIGGER');
                            break;

                        case 'NotEnoughCostForRebuyVipException':
                            modalService.openBalanceErrorModal('rebuy.html', response.data.error.message);
                            break;

                        case 'NotEnoughCostForRebuyRegularException':
                            modalService.openBalanceErrorModal('rebuy-bonus.html', response.data.error.message);
                            break;

                        case 'RebuyNotAvailableException':
                        case 'AddonNotAvailableException':
                            modalService.openTextModal('EXCHANGE_SP__PURCHASE_YOUALSOBUY');
                            break;

                        case 'StackMoreThenStarsStackException':
                            modalService.openTextModal('EXCHANGE_SP__PURCHASE_YOUSTACKBIGGERTHATSTART');
                            break;
                    }
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
    }

})();
