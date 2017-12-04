(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('paymentService', paymentService);

    paymentService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function paymentService($http) {
        /**
         * @type {StarpointShopItem[]}
         */
        var shopItems = [
            {
                "totalCost": 1,
                "starpoints": 1000,
                "bonusPercent":0,
                "code":"ZDCGZYWP32ZYG"
            },
            {
                "totalCost": 3,
                "starpoints": 3000,
                "bonusPercent":0.1,
                "code": "RSC6Q899CUUGJ"
            },
            {
                "totalCost": 5,
                "starpoints": 5000,
                "bonusPercent":0.2,
                "code":"SZSPZN9DCX2VL"
            },
            {
                "totalCost": 10,
                "starpoints": 10000,
                "bonusPercent":0.3,
                "code":"5UBQQ2T3GRRYU"
            },
            {
                "totalCost": 15,
                "starpoints": 15000,
                "bonusPercent":0.4,
                "code":"HFWC7WX4MLWP2"
            },
            {
                "totalCost": 30,
                "starpoints": 30000,
                "bonusPercent":0.5,
                "code":"WM52JSH3NCGX6"
            }
        ];
        
        this.getShopItems = getShopItems;
        this.paymentTransaction = paymentTransaction;
        this.conversionTransaction = conversionTransaction;
        this.withdrawTransaction = withdrawTransaction;
        this.getGainValue = getGainValue;
        this.getUserTransactions = getUserTransactions;
        this.getUserBonuses = getUserBonuses;
        this.getTournamentTransactions = getTournamentTransactions;

        ////////////////

        /**
         * @returns {StarpointShopItem[]}
         */
        function getShopItems() {
            return shopItems;
        }

        /**
         * @param {PaymentData} paymentData
         * @returns {angular.IHttpPromise<*>}
         */
        function paymentTransaction(paymentData) {
            return $http.post('/api/transaction/pay', paymentData);
        }

        /**
         * 
         * @param {ConversionData} conversionData
         * @returns {angular.IHttpPromise<*>}
         */
        function conversionTransaction(conversionData) {
            return $http.post('/api/transaction/conversion/do', conversionData);
        }

        /**
         * Запрос на вывод средств
         * @param {number} dollars
         * @return {angular.IHttpPromise<void>}
         */
        function withdrawTransaction(dollars) {
            var data = {
                message: 'запрос на вывод денег', // TODO: ???
                value: dollars * 100
            };
            
            return $http.post('/api/transaction/withdraw', data);
        }

        /**
         * Получение доступной для вывода суммы
         * @return {angular.IPromise<number>}
         */
        function getGainValue() {
            return $http
                .get('/api/transaction/gain')
                .then(onGetGainValueComplete);
            
            function onGetGainValueComplete(response) {
                return response.data.data.value;
            }
        }

        /**
         * Получение списка транзакций пользователя
         * @param {number} page
         * @param {number} perpage
         * @return {angular.IPromise<*>}
         */
        function getUserTransactions(page, perpage) {
            var url = '/api/transaction/my?page=' + page + '&perPage=' + perpage;
            
            return $http
                .get(url)
                .then(onGetUserTransactionComplete);
            
            function onGetUserTransactionComplete(response) {
                return response.data.data;
            }
        }

        /**
         * Получение статистики по бонусам
         * @return {angular.IPromise<*>}
         */
        function getUserBonuses() {
            return $http
                .get('/api/surcharge/all')
                .then(onGetUserBonusesComplete);

            function onGetUserBonusesComplete(response) {
                return response.data.data;
            }
        }

        /**
         * Список транзакций по турниру
         * @param {number} tournamentId
         * @return {angular.IPromise<*>}
         */
        function getTournamentTransactions(tournamentId) {
            return $http
                .get('/api/transaction/my-by-tournament/'+ tournamentId)
                .then(function(response){
                    return response.data.data;
                });
        }
    }

})();