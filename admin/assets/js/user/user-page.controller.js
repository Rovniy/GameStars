(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('UserPageController', UserPageController);

    UserPageController.$inject = ['$scope', '$http', '$routeParams', '$timeout', 'config', 'tournamentService', 'modalService'];

    /* @ngInject */
    /**
     * Страница инфы по пользователю
     * @param $scope
     * @param {angular.IHttpService} $http
     * @param $routeParams
     * @param $timeout
     * @param config
     * @param {tournamentService} tournamentService
     * @param {Admin.modalService} modalService
     * @constructor
     */
    function UserPageController($scope, $http, $routeParams, $timeout, config, tournamentService, modalService) {
        var vm = this;

        vm.userId = $routeParams.id;
        vm.index = 0;
        vm.loading = false;
        vm.banRemoveSuccess = false;
        vm.banRemoveError = false;
        vm.banList = undefined;
        vm.currentTransPage = 1;
        vm.transactions = undefined;
        vm.perPageTransactionPage = config.userTransactions.perPage;
        vm.tournaments = undefined;
        vm.banReason = '';
        vm.banType = 'ACCOUNT';
        vm.banSuccess = false;
        vm.banSelected = false;
        vm.banTimeInterval = undefined;
        vm.userData = undefined;
        vm.statistic = undefined;

        vm.ban = ban;
        vm.removeBan = removeBan;
        vm.getUserRealPointsVip = getUserRealPointsVip;
        vm.getUserRealPointsBonus = getUserRealPointsBonus;
        vm.disqualify = disqualify;
        vm.openWithdrawalModal = openWithdrawalModal;
        vm.getUserTransactionsData = getUserTransactionsData;

        activate();

        ////////////////

        function activate() {
            $http
                .get('/api/adm/match/userStatistic?id=' + vm.userId)
                .then(function (response) {
                    vm.statistic = response.data;
                });

            getUserData();
            getBanList();
            getUserTransactionsData();
            getTournamentsData();
        }
        
        function getUserData() {
            return $http
                .get('/api/adm/user/' + vm.userId)
                .then(function (response) {
                    vm.userData = response.data.data;
                    vm.userWinRate = Math.round(vm.userData.user.winRate*100);
                });
        }

        function getBanList() {
            return $http
                .get('/api/reaction/ban/list?userId=' + vm.userId)
                .then(function (response) {
                    vm.banList = response.data.data;
                });
        }

        //Получение транзакций по пользователю
        function getUserTransactionsData() {
            var url = '/api/adm/transaction/' + vm.userId + '?page=' + (vm.currentTransPage - 1) + '&perPage=' + vm.perPageTransactionPage;

            return $http
                .get(url)
                .then(function (response) {
                    vm.transactions = response.data.data;
                });
        }
        
        function getTournamentsData() {
            return $http
                .get('/api/adm/member/' + vm.userId)
                .then(function (response) {
                    vm.tournaments = response.data;
                });
        }

        function ban() {
            if (!vm.banReason) {
                return;
            }

            var data = {
                banType: vm.banType || 'GAME',
                timeInterval: vm.banTimeInterval * 60, // минуты переводим в секунды
                target: vm.userId,
                reason: vm.banReason
            };

            vm.loading = true;

            $http
                .post('/api/reaction/ban/create', data)
                .then(function () {
                    vm.banSuccess = true;
                    vm.banSelected = false;

                    $timeout(function () {
                        vm.banSuccess = false;
                    }, 3000);

                })
                .then(getBanList)
                .catch(function () {
                    $scope.banError = true;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function removeBan() {
            vm.loading = true;
            vm.banRemoveSuccess = false;
            vm.banRemoveError = false;

            $http
                .delete('/api/reaction/ban/remove?userId=' + vm.userId)
                .then(getBanList)
                .then(function () {
                    vm.banRemoveSuccess = true;
                })
                .catch(function () {
                    vm.banRemoveError = true;
                })
                .finally(function () {
                    vm.loading = false;

                    $timeout(function () {
                        vm.banRemoveSuccess = false;
                        vm.banRemoveError = false;
                    }, 3000);
                });
        }

        function getUserRealPointsVip() {
            var currency = getUserRealPoints();

            if (currency){
                return (currency.count / 100).toFixed(2);
            }
        }

        function getUserRealPointsBonus() {
            var currency = getUserRealPoints();

            if (currency){
                return (currency.bonus / 100).toFixed(2);
            }
        }

        function getUserRealPoints() {
            if (!vm.userData){
                return;
            }

            var currency;

            for (var i = 0; i < vm.userData.user.currencyList.length; i++){
                currency = vm.userData.user.currencyList[i];

                if (currency.id.type === 'REAL_POINTS'){
                    return currency;
                }
            }
        }

        /**
         * Дисквалификация из турнира
         * @param {{disqualified: boolean, tournament: {id: number}}} tournament
         */
        function disqualify(tournament) {
            tournament.disqualified = true;

            tournamentService
                .disqualifyUser(tournament.tournament.id, vm.userId) //TODO: fix tournament.id
                .catch(function () {
                    tournament.disqualified = false;
                });
        }
        
        function openWithdrawalModal() {
            var modalInstance = modalService.openModal('user-withdrawal.html', { controller: 'WithdrawalModalController' }, { userId: vm.userId });
            modalInstance.result.then(getUserData);
        }
    }

})();