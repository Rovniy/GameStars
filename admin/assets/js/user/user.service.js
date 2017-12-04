(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('userService', userService);

    userService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function userService($http) {
        this.withdraw = withdraw;
        this.getWithdrawInfo = getWithdrawInfo;

        ////////////////

        /**
         * Вывод денег с пользователя
         * @param {string} userId
         * @param {number} amount
         * @return {angular.IHttpPromise<void>}
         */
        function withdraw(userId, amount) {
            var data = {
                userId: userId,
                value: amount
            };
            
            return $http.post('/api/adm/transaction/withdraw', data);
        }

        /**
         * 
         * @param {string} userId
         * @return {angular.IPromise<*>}
         */
        function getWithdrawInfo(userId) {
            return $http
                .get('/api/adm/transaction/withdraw/'+userId+'/info')
                .then(onGetWithdrawInfoComplete);

            function onGetWithdrawInfoComplete(response) {
                return response.data.data;
            }
        }
    }

})();