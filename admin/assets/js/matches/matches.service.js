(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('matchesService', matchesService);

    matchesService.$inject = ['$http'];

    /* @ngInject */
    function matchesService($http) {
        this.getMatches = getMatches;

        ////////////////

        /**
         * @param {number} page
         * @param {number} perPage
         * @param {string} game
         * @param {string} orderBy
         * @param {string} orderDirection
         * @param {Object} filters
         * @return {angular.IPromise<*>}
         */
        function getMatches(page, perPage, game, orderBy, orderDirection, filters) {
            var url = '/api/adm/match/list';

            url += '?page=' + page + '&limit=' + perPage;

            if (game && game !== 'all') {
                url += '&game=' + game;
            }

            if (orderBy) {
                url += '&orderBy=' + orderBy + '&orderDirection=' + orderDirection;
            }

            if (filters) {
                for (var key in filters) {
                    url += '&' + key + '=' + filters[key];
                }
            }

            return $http
                .get(url)
                .then(onGetMatchesComplete);

            function onGetMatchesComplete(response) {
                return response.data;
            }
        }
    }

})();