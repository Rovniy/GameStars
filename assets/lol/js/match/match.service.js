(function () {
    'use strict';

    angular
        .module('gamestar')
        .service('matchService', matchService);

    matchService.$inject = ['$http'];

    /* @ngInject */
    /**
     *
     * @param {angular.IHttpService} $http
     */
    function matchService($http) {
        this.getQueueCount = getQueueCount;
        this.applyMatch = applyMatch;

        ////////////////

        /**
         * Получение размера очереди в матчах
         * @param {string} currencyType
         * @param {string} [tournamentId]
         * @param {number} [gameRegionId]
         * @return {angular.IPromise<*>}
         */
        function getQueueCount(currencyType, tournamentId, gameRegionId) {
            var getUrl = '/api/lol/match/queuecount?currencyType=' + currencyType;

            if (gameRegionId) {
                getUrl += '&gameRegionId=' + gameRegionId;
            }

            if (tournamentId) {
                getUrl += '&tournamentId=' + tournamentId;
            }

            return $http
                .get(getUrl)
                .then(function (response) {
                    return response.data.count;
                });
        }

        /**
         * Вступление в очередь
         * @param {string} game
         * @param {MatchApplyData} data
         * @return {angular.IHttpPromise<void>}
         */
        function applyMatch(game, data) {
            var url = '/api/' + game + '/match/apply';

            return $http.post(url, data);
        }
    }

})();

/**
 * @typedef {Object} MatchApplyData
 * @property {number} bid
 * @property {string} currencyType
 * @property {number} gameRegionId
 * @property {boolean} [force=false]
 * @property {string} [teamSize]
 * @property {string} [patry]
 */