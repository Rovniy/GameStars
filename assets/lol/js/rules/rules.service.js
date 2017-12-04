(function () {
    'use strict';

    angular
        .module('gamestar')
        .service('rulesService', rulesService);

    rulesService.$inject = ['$http', '$rootScope', 'localizationService'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     * @param $translate
     * @param {localizationService} localizationService
     */
    function rulesService($http, $translate, localizationService) {
        this.getAgreement = getAgreement;

        ////////////////

        /**
         * Получение пользовательского соглашения
         * @param {string} lang
         * @returns {angular.IPromise<*>}
         */
        function getAgreement(lang) {
            return $http
                .get('/api/'+ (lang || localizationService.getLanguage()).toLowerCase() +'/agreement')
                .then(getAgreementComplete)
                .catch(getAgreementFailde);

            function getAgreementComplete(responce){
                return responce.data.data.agreement.text;
            }

            function getAgreementFailde(){
                return  $translate('APP_NOTIFICATION__SERVER_ERROR');
            }
        }
    }

})();