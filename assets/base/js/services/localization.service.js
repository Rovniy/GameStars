(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('localizationService', localizationService);

    localizationService.$inject = ['$translate', 'Analytics'];

    /* @ngInject */
    /**
     *
     * @param {angular.translate.ITranslateService} $translate
     * @param {Analytics} Analytics
     */
    function localizationService($translate, Analytics) {
        var currentLanguage;

        this.getLanguage = getLanguage;
        this.setLanguage = setLanguage;

        ////////////////

        /**
         * Получение текущего языка
         * @returns {string}
         */
        function getLanguage() {
            if (!currentLanguage) {
                currentLanguage = (
                    $translate.use() ||
                    $translate.storage().get($translate.storageKey()) ||
                    $translate.preferredLanguage()
                ).toUpperCase();
            }

            return currentLanguage;
        }

        function setLanguage(lang) {
            Analytics.trackEvent('language', 'change', '', {
                currentLang: getLanguage(),
                lang: lang
            });

            $translate.use(lang.toLowerCase());
            currentLanguage = lang;
        }
    }

})();

