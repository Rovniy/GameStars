(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('TournamentListController', TournamentListController);

    TournamentListController.$inject = ['tournamentsService'];

    /* @ngInject */
    /**
     * @param {tournamentsService} tournamentsService
     * @constructor
     */
    function TournamentListController(tournamentsService) {
        var vm = this;

        /** @type {[*]} */
        vm.tournaments = undefined;
        vm.sortTour = sortTour;


        activate();

        ////////////////

        function activate() {
            return tournamentsService
                .getList('LOL')
                .then(function (tournaments) {
                    vm.tournaments = tournamentsService.tournamentsPrimarySort(tournaments);
                });
        }

        function sortTour(name, direct){
            if (!vm.tournaments){
                return;
            }

            var sort = getSortFunction(name, direct);

            vm.tournaments.sort(sort);
        }

        function getSortFunction(name, direct) {
            if (name === 'buyIn'){
                return function (a, b) {
                    return (a['tournamentType']['buyIn'] - b['tournamentType']['buyIn']) * direct;
                }
            }
            else{
                return function (a, b) {
                    return (a[name] - b[name]) * direct;
                }
            }
        }
    }
})();

