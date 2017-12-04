(function () {
    'use strict';

    /**
     * Объявление зависимостей от сторонних библиотек
     */
    angular
        .module('gamestar.core', [
            'ngAnimate',
            'ngRoute',
            'ngSanitize',
            'ngCookies',
            'ui.bootstrap',
            'notyModule',
            'angularFileUpload',
            'environment',
            'widget.scrollbar',
            'pascalprecht.translate',
            'credit-cards'
        ]);

})();