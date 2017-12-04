(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('referalService', referalService);

    referalService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function referalService($http) {
        this.getReferalLink = getReferalLink;
        this.getReferalBonus = getReferalBonus;

        ////////////////

        /**
         * @returns {angular.IPromise<ReferralData>}
         */
        function getReferalLink() {
            return $http
                .get('/api/referral')
                .then(getReferalLinkComplete);

            function getReferalLinkComplete(response) {
                return response.data.data;
            }
        }

        /**
         * @returns {angular.IHttpPromise<void>}
         */
        function getReferalBonus() {
            return $http.post('/api/transaction/bonus/referral', {});
        }
    }

})();