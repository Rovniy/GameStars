(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('tournamentService', tournamentService);

    tournamentService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function tournamentService($http) {
        /** @deprecated */
        this.getTournamentTypeList = getTournamentTypeList;
        this.getTournament = getTournament;
        this.getGames = getGames;
        this.createTournament = createTournament;
        this.updateTournament = updateTournament;
        this.getTournamentList = getTournamentList;
        this.getTournamentLadder = getTournamentLadder;
        this.getTournamentStat = getTournamentStat;
        this.disqualifyUser = disqualifyUser;
        this.finish = finish;
        this.cancel = cancel;

        ////////////////

        /**
         * @returns {angular.IPromise<*>}
         */
        function getTournamentTypeList() {
            return $http
                .get('/api/adm/tournament/type/list', {cache: true})
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         *
         * @param {number} id
         * @returns {angular.IPromise<*>}
         */
        function getTournament(id) {
            return $http
                .get('/api/adm/tournament/' + id)
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         * Получение списка серверов (gameRegion)
         * @returns {angular.IPromise<*>}
         */
        function getGames() {
            //TODO: перенести в другой сервис
            return $http
                .get('/api/games', {cache: true})
                .then(function (response) {
                    return response.data.data;
                });
        }

        /**
         *
         * @param data
         * @returns {angular.IHttpPromise<*>}
         */
        function createTournament(data) {
            return $http.post('/api/adm/tournament', data);
        }

        /**
         *
         * @param id
         * @param data
         * @returns {angular.IHttpPromise<*>}
         */
        function updateTournament(id, data) {
            return $http.put('/api/adm/tournament/' + id, data);
        }

        /**
         * Получение списка турниров
         * @param {string} game
         * @param {number} page
         * @param {number} perPage
         * @param {string} orderBy
         * @param {string} orderDirection
         * @return {angular.IPromise<*>}
         */
        function getTournamentList(game, page, perPage, orderBy, orderDirection) {
            var url = '/api/adm/tournament/list';
            //page = page || 0;
            //perPage = perPage || 100;
            url += '?page=' + page + '&limit=' + perPage;
            if (game && game !== 'all') {
                url += '&game=' + game;
            }
            if (orderBy) {
                url += '&orderBy=' + orderBy + '&orderDirection=' + orderDirection;
            }

            return $http
                .get(url)
                .then(onGetTournamentListComplete);

            function onGetTournamentListComplete(response) {
                var tournaments = response.data.data;

                for (var i = 0; i < tournaments.length; i++) {
                    var tournament = tournaments[i];
                    tournament.defaultBuyIn = getDefaultBuyIn(tournament.buyIns) || {};
                }

                return {
                    data: tournaments,
                    pagination: response.data.pagination
                };
            }

            /**
             * @param {{default: boolean}[]} buyIns
             * @returns *
             */
            function getDefaultBuyIn(buyIns) {
                for (var i = 0; i < buyIns.length; i++) {
                    if (buyIns[i].isDefault) {
                        return buyIns[i];
                    }
                }
            }
        }

        /**
         * Список участников турнира
         * @param {number} id
         * @return {angular.IPromise<*>}
         */
        function getTournamentLadder(id) {
            return $http
                .get('/api/adm/tournament/' + id + '/ladder')
                .then(onGetTournamentLadder);

            function onGetTournamentLadder(response) {
                return response.data.data;
            }
        }

        /**
         * Статистика по турниру
         * @param {number} id
         * @return {angular.IPromise<*>}
         */
        function getTournamentStat(id) {
            return $http
                .get('/api/adm/match/tournament/' + id + '/stat')
                .then(onGetTournamentStatLadder);

            function onGetTournamentStatLadder(response) {
                return response.data.data;
            }
        }

        /**
         * Дисквалификация участника турнира
         * @param {number} tournamentId
         * @param {string} userId
         * @return {angular.IHttpPromise<void>}
         */
        function disqualifyUser(tournamentId, userId) {
            return $http.post('/api/adm/tournament/' + tournamentId + '/disqualify/' + userId, {});
        }

        /**
         * Завершение турнира
         * @param {number} tournamentId
         * @return {angular.IHttpPromise<void>}
         */
        function finish(tournamentId) {
            return $http.post('/api/adm/tournament/' + tournamentId + '/finish', {});
        }

        /**
         * Отмена турнира
         * @param {number} tournamentId
         * @return {angular.IHttpPromise<void>}
         */
        function cancel(tournamentId) {
            return $http.post('/api/adm/tournament/' + tournamentId + '/cancel', {});
        }
    }

})();