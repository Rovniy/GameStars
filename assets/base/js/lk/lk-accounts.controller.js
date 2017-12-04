(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkAccountsController', LkAccountsController);

    LkAccountsController.$inject = ['Analytics', 'userProfileService', 'modalService'];

    /* @ngInject */
    /**
     * @param {Analytics} Analytics
     * @param {userProfileService} userProfileService
     * @param {modalService} modalService
     * @constructor
     */
    function LkAccountsController(Analytics, userProfileService, modalService) {
        var vm = this;

        vm.userProfile = undefined;
        vm.loading = false;
        vm.deleteId = undefined;
        vm.accounts = undefined;

        vm.deleteGameAccount = deleteGameAccount;
        vm.refreshAccountData = refreshAccountData;
        vm.openConnectAccountModal = openConnectAccountModal;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('lk_page', 'accounts', '', {});

            $(document).ready(function (){
                $('.connect-starclient').height($('.connect-games').height() + 100); //Делаем одинаковой высоту блоков
            });

            userProfileService
                .loadUserProfile()
                .then(function(userProfile){
                    mapGameAccounts(userProfile);
                });
        }

        function deleteGameAccount(gameAccount, $event) {
            if (vm.loading){
                return;
            }

            var element = angular.element($event.target.parentNode);

            vm.loading = true;
            vm.deleteId = gameAccount.id;
            element.addClass('disabled');
            
            Analytics.trackEvent('game_account', 'remove', '', {
                game: gameAccount.gameRegion.gameType, //
                location: gameAccount.gameRegion.regionName,
                game_username: gameAccount.name
            });

            userProfileService
                .deleteGameAccount(gameAccount.gameRegion.gameType, gameAccount.id)
                .then(function () {
                    var userProfile = userProfileService.getUserProfile();
                    mapGameAccounts(userProfile);
                })
                .finally(function () {
                    vm.loading = false;
                    vm.deleteId = undefined;
                    element.removeClass('disabled');
                });
        }

        // Обновление данных аккаунта
        function refreshAccountData(game, $event) {
            if (vm.loading){
                return;
            }

            var icon = angular.element($event.target);

            vm.loading = true;
            // лучше так не делать =)
            icon.addClass('fa-spin');

            userProfileService
                .refreshAccountData(game)
                .then(userProfileService.reloadUserProfile)
                .then(function (userProfile) {
                    mapGameAccounts(userProfile);
                })
                .finally(function () {
                    vm.loading = false;
                    icon.removeClass('fa-spin');
                });
        }

        function openConnectAccountModal() {
            var instance = modalService.openModal('connect-account.html', { controller: 'AddAccountModalController' });

            instance.result
                .then(userProfileService.reloadUserProfile)
                .then(function (userProfile) {
                    mapGameAccounts(userProfile);
                });
        }

        function mapGameAccounts(userProfile) {
            vm.accounts = {
                'LOL': [],
                'HEARTHSTONE': [],
                'WOT': [],
                'DOTA2': [],
                'CSGO': []
            };
            
            for (var i = 0; i < userProfile.gameAccounts.length; i++){
                var account = userProfile.gameAccounts[i];
                var accounts = vm.accounts[account.gameRegion.gameType];

                accounts.push(account);
            }
        }
    }

})();


