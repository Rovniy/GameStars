(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('AddAccountModalController', AddAccountModalController);

    AddAccountModalController.$inject = ['$uibModalInstance', 'Analytics', 'userProfileService', 'modalData'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {Analytics} Analytics
     * @param {userProfileService} userProfileService
     * @param {{regionId: string}} modalData
     * @constructor
     */
    function AddAccountModalController($uibModalInstance, Analytics, userProfileService, modalData) {
        var vm = this;

        vm.tabs = [
            {title: 'hearthstone', content: '', disabled: true},
            {title: 'dota', content: '', disabled: true},
            {title: 'csgo', content: '', disabled: true}
        ];

        vm.error = undefined;
        vm.loading = false;
        vm.summonerName = '';
        vm.regionId = modalData.regionId || '';

        vm.sendConnectAccount = sendConnectAccount;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('game_account', 'popup_show', '', {});
        }

        function sendConnectAccount() {
            Analytics.trackEvent('game_account', 'add', '', {
                game: 'lol', //
                location: vm.regionId,
                game_username: vm.summonerName
            });

            vm.loading = true;

            return userProfileService
                .connectAccount(vm.regionId, vm.summonerName)
                .then(onSuccess)
                .catch(onFailed)
                .finally(onFinally);

            function onSuccess() {
                Analytics.trackEvent('game_account', 'add_success', '', {});
                $uibModalInstance.close();
            }

            function onFailed(error) {
                if (!error.type) {
                    return;
                }
                switch (error.type) {
                    case 'AccountAlreadyExistException':
                        Analytics.trackEvent('game_account', 'error_already_exist', '', {});
                        vm.error = 'CONNECT_ACCOUNT__SUMMONER_NAME_JOIN_TO_ANOTHER_ACCOUNT';
                        break;

                    case 'AccountAlreadyLinkException':
                    case 'ActiveAccountExistException':
                        vm.error = 'CONNECT_ACCOUNT__SUMMONER_NAME_JOIN_TO_ANOTHER_SERVER';
                        break;

                    case 'AccountNotFoundException':
                        Analytics.trackEvent('game_account', 'error_not_found', '', {});
                        vm.error = 'CONNECT_ACCOUNT__SUMMONER_NAME_NOT_FOUND';
                        break;

                    case 'PersistenceException':
                        vm.error = 'CONNECT_ACCOUNT__ERROR_REFER_TO_ADMIN';
                        break;

                    default:
                        vm.error = 'CONNECT_ACCOUNT__ERROR';
                        break;
                }
            }

            function onFinally() {
                vm.loading = false;
            }
        }
    }

})();