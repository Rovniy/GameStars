(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('applicationsService', applicationsService);

    applicationsService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function applicationsService($http) {
        this.getApplications = getApplications;

        ////////////////

        /**
         * @param {string} game
         * @returns {angular.IPromise<*>}
         */
        function getApplications(game) {
            return $http
                .get('/api/adm/' + game + '/applications')
                .then(function (response) {
                    return response.data;
                });
        }
    }

})();