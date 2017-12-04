(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('promoCodesService', promoCodesService);

    promoCodesService.$inject = ['$http'];

    /* @ngInject */
    /**
     * Сервис для работы с промокодами
     * @param {angular.IHttpService} $http
     */
    function promoCodesService($http) {
        this.getPromoCodes = getPromoCodes;
        this.getPromoItems = getPromoItems;
        this.create = create;

        ////////////////

        /**
         * @param {number} page
         * @param {number} [perPage=50]
         * @return {angular.IPromise<*>}
         */
        function getPromoCodes(page, perPage) {
            if (!perPage){
                perPage = 50;
            }
            
            var url = '/api/reaction/promo/list?page=' + page + '&perPage=' + perPage;
            
            return $http
                .get(url)
                .then(function (response) {
                   return response.data; 
                });
        }

        /**
         * @return {angular.IPromise<*>}
         */
        function getPromoItems() {
            var url = '/api/reaction/item/list?page=0&perPage=1000';

            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         * Создание нового промо-кода
         * @param {*} data
         * @return {angular.IHttpPromise<*>}
         */
        function create(data) {
            return $http.post('/api/reaction/promo/create', data);
        }
    }

})();