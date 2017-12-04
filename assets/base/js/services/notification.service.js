(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('notificationService', notificationService);

    notificationService.$inject = ['$translate', 'noty'];

    /* @ngInject */
    /**
     * Сервис для уведомлений на сайте
     * @param $translate
     * @param noty
     */
    function notificationService($translate, noty) {
        this.show = show;
        this.success = success;
        this.error = error;
        this.info = information;
        this.cofirm = cofirm;
        this.browserNotification = browserNotification;

        ////////////////

        /**
         * @param {string} translationId
         * @param {string} type
         * @param {boolean} [showBrowserNotification]
         * @return {angular.IPromise<void>}
         */
        function show(translationId, type, showBrowserNotification) {
            return $translate(translationId)
                .then(function (translation) {
                    //переведено
                    return translation
                })
                .catch(function () {
                    //перевод не найден, используем исходный текст
                    return translationId;
                })
                .then(function (text) {
                    noty.show(text, type || 'information');
                    showBrowserNotification && browserNotification(text);
                });
        }

        /**
         * @param {string} translationId
         * @param {boolean} [showBrowserNotification]
         * @return {angular.IPromise.<void>}
         */
        function success(translationId, showBrowserNotification) {
            return show(translationId, 'success', showBrowserNotification);
        }

        /**
         * @param {string} translationId
         * @param {boolean} [showBrowserNotification]
         * @return {angular.IPromise.<void>}
         */
        function error(translationId, showBrowserNotification) {
            return show(translationId, 'error', showBrowserNotification);
        }

        /**
         * @param {string} translationId
         * @param {boolean} [showBrowserNotification]
         * @return {angular.IPromise.<void>}
         */
        function information(translationId, showBrowserNotification) {
            return show(translationId, 'information', showBrowserNotification);
        }

        /**
         * @param {string} translationId
         * @param {boolean} [showBrowserNotification]
         * @return {angular.IPromise.<void>}
         */
        function cofirm(translationId, showBrowserNotification) {
            return show(translationId, 'cofirm', showBrowserNotification);
        }

        /**
         * Уведомления браузера. работает 100% в Chrome 27, Firefox 22, Safari 6
         * @param {string} text
         */
        function browserNotification(text) {
            if (!window.Notification) return;

            Notification.requestPermission(newMessage);

            function newMessage(permission) {
                if (permission != "granted") return;

                try {
                    var gs_BrowserNoty = new Notification("GameStars Team", {
                        lang: 'ru-RU',
                        tag: "gs_info",
                        body: text,
                        icon: "/src/img/gsBrowserNoty.png"
                    });

                    gs_BrowserNoty.onerror = function () {
                        if (!window.Notification) return;
                        Notification.requestPermission(newMessage);
                    };
                } catch (e) {
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=481856
                }
            }
        }
    }

})();

