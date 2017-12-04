(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('tournamentsService', tournamentsService);

    tournamentsService.$inject = ['$http', '$q'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     * @param {angular.IQService} $q
     */
    function tournamentsService($http, $q) {
        this.getList = getList;
        this.tournamentsPrimarySort = tournamentsPrimarySort;
        this.getGames = getGames;
        this.getTournament = getTournament;
        this.getLadder = getLadder;
        this.getUserStatus = getUserStatus;
        this.joinCheck = joinCheck;
        this.join = join;
        this.apply = apply;

        ////////////////

        /**
         * Получение списка турниров
         * @param {string} [game]
         * @returns {angular.IPromise<*>}
         */
        function getList(game) {
            var url = '/api/tournament/list?count=25';

            if (game) {
                url += '&game=' + game;
            }

            return $http
                .get(url)
                .then(onGetListComplete);

            function onGetListComplete(res) {
                return res.data.data;
            }
        }

        /**
         * Сортировка турниров по умолчанию: сначала по статусу, потом по дате (сначала новые и активные).
         * @param {[*]} tournaments
         * @returns {[*]}
         */
        function tournamentsPrimarySort(tournaments) {
            return tournaments.sort(function (a, b) {
                if (a.status === b.status) {
                    return a.startDate - b.startDate;
                }

                return a.status !== 'FINISH' ? 1 : -1;
            }).reverse();
        }

        /**
         * @returns {angular.IPromise<GameRegion[]>}
         */
        function getGames() {
            return $http
                .get('/api/games', {cache: true})
                .then(function (response) {
                    return response.data.data;
                });
        }

        /**
         * Получение данных турнира
         * @param {number} id
         * @returns {angular.IPromise<Tournament>}
         */
        function getTournament(id) {
            return $http
                .get('/api/tournament/' + id)
                .then(onGetTournamentComplete);

            /**
             * @param {angular.IHttpPromiseCallbackArg} response
             * @return {Tournament}
             */
            function onGetTournamentComplete(response) {
                /** @type {Tournament} */
                var tournament = response.data.data;//award_list

                if (angular.isArray(tournament.award_list)) {
                    for (var i = 0; i < tournament.award_list.length; i++) {
                        var award = tournament.award_list[i];

                        if (award.fromPos) {
                            if (award.fromPos === award.toPos) {
                                award.position = award.fromPos;
                            }
                            else {
                                award.position = award.fromPos + '-' + award.toPos;
                            }
                        }
                    }
                }

                return tournament;
            }
        }

        /**
         * Получение данных по участникам турнира
         * @param {number} id
         * @returns {angular.IPromise<*>}
         */
        function getLadder(id) {
            return $http
                .get('/api/tournament/' + id + '/ladder')
                .then(function (response) {
                    return response.data.data;
                });
        }

        /**
         * Получение текущего статуса пользователя в турнире
         * @param {number} id
         * @returns {angular.IPromise<UserTournamentStatus>}
         */
        function getUserStatus(id) {
            return $http
                .get('/api/tournament/' + id + '/me')
                .then(function (response) {
                    return response.data.data;
                });
        }

        /**
         * Проверка возможности вступления в турнир
         * @param {number} id
         * @param {string} currencyType
         * @param {string} [utm]
         * @returns {angular.IPromise<*|ServerError>}
         */
        function joinCheck(id, currencyType, utm) {
            var data = {
                currency: currencyType,
                warUtm: utm
            };

            return $http
                .post('/api/tournament/' + id + '/join-check', data)
                .catch(function (response) {
                    return $q.reject(response.data.error);
                });
        }

        /**
         * Вступление в турнир
         * @param {number} id
         * @param {string} currencyType
         * @param {string} [utm]
         * @param {boolean} [force=false]
         * @returns {angular.IPromise<*|ServerError>}
         */
        function join(id, currencyType, utm, force) {
            var data = {
                currency: currencyType,
                warUtm: utm,
                force: !!force
            };

            return $http
                .post('/api/tournament/' + id + '/join', data)
                .catch(function (response) {
                    return $q.reject(response.data.error);
                });
        }

        /**
         * Встать в очерель турнира
         * @param {string} game
         * @param {*} data
         * @returns {angular.IPromise<*|ServerError>}
         */
        function apply(game, data) {
            return $http
                .post('/api/' + game + '/match/apply', data)
                .catch(function (response) {
                    return $q.reject(response.data.error);
                });
        }
    }

})();