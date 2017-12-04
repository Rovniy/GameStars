(function () {
    'use strict';

    angular
        .module('gsadmin')
        .config(config);

    config.$inject = ['$locationProvider', '$translateProvider', 'uiDatetimePickerConfig', 'uibTimepickerConfig'];

    /* @ngInject */
    /**
     * @param {angular.ILocationProvider} $locationProvider
     * @param {angular.translate.ITranslateProvider} $translateProvider
     * @param {*} uiDatetimePickerConfig
     * @param {angular.ui.bootstrap.ITimepickerConfig} uibTimepickerConfig
     */
    function config ($locationProvider, $translateProvider, uiDatetimePickerConfig, uibTimepickerConfig) {
        $locationProvider.html5Mode(true);

        $translateProvider
            .useStaticFilesLoader({
                prefix: '/localization/locale-', //{{prefix}}{{langKey}}{{suffix}}
                suffix: '.json'
            })
            .useLocalStorage()
            //.fallbackLanguage('en')
            //.determinePreferredLanguage()
            .preferredLanguage('ru')
            .useMissingTranslationHandlerLog();

        uiDatetimePickerConfig.appendToBody = true;
        uiDatetimePickerConfig.dateFormat = 'dd.MM.yyyy HH:mm:ss';

        uibTimepickerConfig.showMeridian = false;
        uibTimepickerConfig.showSeconds = true;
    }

})();