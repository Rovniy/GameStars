(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('TournamentListController', TournamentListController);

    TournamentListController.$inject = ['tournamentService'];

    /* @ngInject */
    /**
     * @param {tournamentService} tournamentService
     * @constructor
     */
    function TournamentListController(tournamentService) {
        var vm = this;

        vm.tournaments = [];
        vm.pagination = undefined;
        vm.page = 1;
        vm.perPage = 50;
        vm.sortReverse = true;  // обратная сортривка
        vm.sortType = 'startDate'; // значение сортировки по умолчанию
        vm.sortReverse = true;  // обратная сортривка
        vm.sortType = 'startDate'; // значение сортировки по умолчанию

        vm.loadTournaments = loadTournaments;
        vm.onSortClick = onSortClick;

        activate();

        ////////////////

        function activate() {
            loadTournaments()
        }
        
        function loadTournaments() {
            return tournamentService
                .getTournamentList('LOL', vm.page - 1, vm.perPage, vm.sortType, vm.sortReverse ? 'DESC' : 'ASC')
                .then(function (tournaments) {
                    vm.tournaments = tournaments.data;
                    vm.pagination = tournaments.pagination;
                });
        }

        /**
         * Клик по сортировке в таблице
         * @param {string} name
         */
        function onSortClick(name) {
            vm.sortReverse = vm.sortType === name ? !vm.sortReverse : true;
            vm.sortType = name;

            loadTournaments();
        }
    }

})();