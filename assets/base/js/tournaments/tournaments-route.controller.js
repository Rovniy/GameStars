(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('TournamentsRouteController', TournamentsRouteController);

    TournamentsRouteController.$inject = ['$location', '$q', 'Analytics', 'tournamentsService', 'userProfileService'];

    /* @ngInject */
    /**
     * @param {angular.ILocationService} $location
     * @param {angular.IQService} $q
     * @param Analytics
     * @param {tournamentsService} tournamentsService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function TournamentsRouteController($location, $q, Analytics, tournamentsService, userProfileService) {
        var vm = this;

        vm.regions = undefined;
        vm.tournaments = undefined;
        vm.nowCounter = 0;
        vm.todayCounter = 0;
        vm.weeklyCounter = 0;
        vm.selectedServers = '';
        vm.globalFilter = {
            servers: [],
            status: '!FINISH',
            class: '',
            sort: {
                'currentSort': 'regStartDate',
                'reverse': false
            }
        };

        vm.filterByServer = filterByServer;
        vm.isServerChecked = isServerChecked;
        vm.selectServer = selectServer;
        vm.onRowClick = onRowClick;
        vm.checkList = checkList;

        activate();

        ////////////////

        function activate() {


            vm.playNow = moment().valueOf();
            vm.laterToday = moment().add(1, 'days').valueOf();
            vm.thisWeek = moment().add(7, 'days').valueOf();

            var gamesPromise = tournamentsService
                .getGames()
                .then(function (regions) {
                    vm.regions = regions;
                });

            var tournamentsPromise = tournamentsService
                .getList()
                .then(function (tournaments) {
                    vm.tournaments = tournaments;

                    Analytics.trackEvent('tournament', 'list', '', {
                        game: 'LOL', // @TODO fix hardcode
                        amount: vm.tournaments.length
                    });
                });

            $q.all([gamesPromise, tournamentsPromise])
                .then(setCheckedServers)
                .then(checkList);
        }

        function setCheckedServers() {
            return userProfileService
                .loadUserProfile()
                .then(function (userProfile) {
                    if (userProfile.gameAccounts.length === 0){
                        return $q.reject();
                    }

                    userProfile.gameAccounts.forEach(function(f) {
                        vm.globalFilter.servers.push(f.gameRegion.regionId);
                    });
                })
                .catch(function () {
                    vm.regions.forEach(function (f) {
                        vm.globalFilter.servers.push(f.regionId);
                    })
                });
        }

        function checkList() {
            if (!vm.tournaments){
                return;
            }

            vm.nowCounter = 0;
            vm.todayCounter = 0;
            vm.weeklyCounter = 0;

            for (var i = 0; i < vm.tournaments.length; i++) {
                var tournament = vm.tournaments[i];

                if (!isServerChecked(tournament.gameRegion.regionId)){
                    continue;
                }

                if (tournament.status == 'START' || tournament.status == 'POST_REG' || tournament.tournamentClass == 'SIT_AND_GO') {
                    if (tournament.tournamentClass == vm.globalFilter.class || vm.globalFilter.class == '' ) {
                        vm.nowCounter++;
                    }
                }

                if (tournament.startDate < vm.laterToday && tournament.status == 'PRE_REG') {
                    if (tournament.tournamentClass == vm.globalFilter.class || vm.globalFilter.class == '' ) {
                        vm.todayCounter++;
                    }
                }

                if (tournament.startDate < vm.thisWeek && tournament.startDate > vm.laterToday && tournament.status == 'PRE_REG') {
                    if (tournament.tournamentClass == vm.globalFilter.class || vm.globalFilter.class == '' ) {
                        vm.weeklyCounter++;
                    }
                }
            }
        }

        function onRowClick(tournamentId) {
            $location.url('/tournament/lol/' + tournamentId);
        }

        // Выборка моих серверов
        function isServerChecked(server) {
            for (var i = 0; i < vm.globalFilter.servers.length; i++){
                if (vm.globalFilter.servers[i] === server) {
                    return true;
                }
            }

            return false;
        }

        //Смена серверов
        function selectServer(server) {
            if (isServerChecked(server)){
                for (var i = 0; i < vm.globalFilter.servers.length; i++){
                    if (vm.globalFilter.servers[i] === server) {
                        vm.globalFilter.servers.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                vm.globalFilter.servers.push(server);
            }

            checkList();
        }

        //TODO: убрать все фильтры. Фильтры афектят производительность, фильтры бяка @ek
        function filterByServer(tournament) {
            for (var i = 0; i < vm.globalFilter.servers.length; i++){
                if (vm.globalFilter.servers[i] === tournament.gameRegion.regionId) {
                    return true;
                }
            }

            return false;
        }

    }

})();