(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('TournamentInfoController', TournamentInfoController);

    TournamentInfoController.$inject = ['$routeParams', '$route', 'tournamentService'];

    /* @ngInject */
    /**
     * @param $routeParams
     * @param {angular.route.IRouteService} $route
     * @param {tournamentService} tournamentService
     * @constructor
     */
    function TournamentInfoController($routeParams, $route, tournamentService) {
        var vm = this;
        var tournamentId = $routeParams.id;

        vm.downloadXml = '/api/adm/tournament/' + tournamentId + '/emails-members';
        vm.statistic_one = '/api/adm/tournament/analytics/all';
        vm.statistic_two = '/api/adm/tournament/' + tournamentId + '/matches';
        vm.statistic_three = '/api/adm/tournament/' + tournamentId + '/players';
        vm.players = undefined;
        vm.stat = undefined;
        vm.canFinish = false;
        vm.processed = undefined;
        vm.canCancel = true;

        vm.disqualify = disqualify;
        vm.onFinishClick = onFinishClick;
        vm.onCancelClick = onCancelClick;

        activate();

        ////////////////

        function activate() {
            tournamentService
                .getTournamentLadder(tournamentId)
                .then(function (data) {
                    vm.players = data.players;
                });

            tournamentService
                .getTournamentStat(tournamentId)
                .then(function (stat) {
                    vm.stat = stat;
                });

            tournamentService
                .getTournament(tournamentId)
                .then(function (tournament) {
                    vm.canFinish = tournament.status === 'FINISH' && !tournament.processed;
                    vm.processed = tournament.processed;
                    //vm.canCancel
                });
        }
        
        function disqualify(player) {
            player.disqualified = true;
            
            tournamentService
                .disqualifyUser(tournamentId, player.userId)
                .catch(function () {
                    player.disqualified = false;
                });
        }
        
        function onFinishClick() {
            onFinishClick.loading = true;
            onFinishClick.error = false;

            tournamentService
                .finish(tournamentId)
                .then(function () {
                    $route.reload();
                })
                .catch(function (response) {
                    onFinishClick.error = JSON.stringify(response.data.error);
                })
                .finally(function () {
                    onFinishClick.loading = false;
                });
        }
        
        function onCancelClick() {
            onCancelClick.loading = true;
            onCancelClick.error = false;

            tournamentService
                .cancel(tournamentId)
                .then(function () {
                    onCancelClick.success = true;
                })
                .catch(function (response) {
                    onCancelClick.error = JSON.stringify(response.data.error);
                })
                .finally(function () {
                    onCancelClick.loading = false;
                });
        }
    }

})();