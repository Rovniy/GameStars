(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('MatchListController', MatchListController);

    MatchListController.$inject = ['$routeParams', 'matchesService', 'tournamentService'];

    /* @ngInject */
    /**
     * @param $routeParams
     * @param {matchesService} matchesService
     * @param {tournamentService} tournamentService
     * @constructor
     */
    function MatchListController($routeParams, matchesService, tournamentService) {
        var vm = this;

        vm.statusList = [
            {id: 'CREATED', name: 'CREATED'},
            {id: 'PREPARE', name: 'PREPARE'},
            {id: 'STARTED', name: 'STARTED'},
            {id: 'FINISHED', name: 'FINISHED'},
            {id: 'COMPLETED', name: 'COMPLETED'},
            {id: 'COMPLETED_WITH_VIOLATION', name: 'COMPLETED_WITH_VIOLATION'},
            {id: 'NOT_FOUND_STAT', name: 'NOT_FOUND_STAT'},
            {id: 'CANCELED', name: 'CANCELED'},
            {id: 'NOT_MATCHED', name: 'NOT_MATCHED'},
            {id: 'BAD_RESULT', name: 'BAD_RESULT'}
        ];
        vm.reportsList = [
            {id: 'USER', name: 'USER'},
            {id: 'STAR_CLIENT', name: 'STAR_CLIENT'},
            {id: 'PRIVILEGED_USER', name: 'PRIVILEGED_USER'},
            {id: 'SUPPORT', name: 'SUPPORT'},
            {id: 'ADMIN', name: 'ADMIN'},
            {id: 'SYSTEM', name: 'SYSTEM'},
        ];
        vm.serverList = undefined;
        vm.matches = undefined;
        vm.pagination = undefined;
        vm.page = 1;
        vm.perPage = 50;
        vm.loading = false;
        vm.sortReverse = true;  // обратная сортривка
        vm.sortType = 'createTime'; // значение сортировки по умолчанию
        vm.completeTimeFrom = null;
        vm.completeTimeTo = moment().valueOf();
        vm.status = null;
        vm.server = null;
        vm.reportsCreatedBy = null;
        vm.verified = false;

        vm.onSortClick = onSortClick;
        vm.loadMatchList = loadMatchList;

        activate();

        ////////////////

        function activate() {
            loadMatchList();

            tournamentService
                .getGames()
                .then(function (regions) {
                    vm.serverList = regions;
                });
        }

        function loadMatchList() {
            if (vm.loading) {
                return;
            }
            vm.loading = true;

            var filters = {};

            if (vm.completeTimeFrom && vm.completeTimeTo) {
                filters.completeTimeFrom = vm.completeTimeFrom;
                filters.completeTimeTo = vm.completeTimeTo;
            }

            if (vm.status) {
                filters.status = vm.status;
            }

            if (vm.server) {
                filters.server = vm.server;
            }

            if (vm.reportsCreatedBy) {
                filters.reportsCreatedBy = vm.reportsCreatedBy;
            }

            if (vm.verified) {
                filters.checkStatus = 'VERIFIED';
            }

            return matchesService
                .getMatches(vm.page - 1, vm.perPage, $routeParams.category, vm.sortType, vm.sortReverse ? 'DESC' : 'ASC', filters)
                .then(function (matches) {
                    vm.matches = matches.data;
                    vm.pagination = matches.pagination;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        /**
         * Клик по сортировке в таблице
         * @param {string} name
         */
        function onSortClick(name) {
            vm.sortReverse = vm.sortType === name ? !vm.sortReverse : true;
            vm.sortType = name;

            loadMatchList();
        }
    }

})();