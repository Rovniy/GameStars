(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('statisticService', statisticService);

    statisticService.$inject = ['$http'];

    /* @ngInject */
    /**
     * Сервис для получения статистики по матчам и турнирам пользователя
     * @param {angular.IHttpService} $http
     */
    function statisticService($http) {
        this.getTournaments = getTournaments;
        this.getRecentMatches = getRecentMatches;

        ////////////////

        /**
         * @param {string} [game]
         * @return {angular.IPromise<object>}
         */
        function getTournaments(game) {
            var url = '/api/tournament/my/list';

            if (game){
                url += '?game=' + game;
            }

            return $http
                .get(url)
                .then(function(response) {
                    return response.data.data;
                });
        }

        /**
         * @param {string} [game]
         * @return {angular.IPromise<object>}
         */
        function getRecentMatches(game) {
            var url = '/api/match/recent';

            if (game){
                url += '?game=' + game;
            }

            return $http
                .get(url)
                .then(function(response) {
                    return response.data.data;
                });
        }
    }

})();