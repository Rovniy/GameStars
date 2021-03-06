(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('intercomService', intercomService);

    intercomService.$inject = [];

    /* @ngInject */
    function intercomService() {
        /**
         * @type {{ emit: function, on: function, off: function }}
         */
        var intercom = Intercom.getInstance();
        
        this.emit = emit;
        this.on = on;
        this.off = off;

        ////////////////

        /**
         * Отправка сообщения в intercom
         * @param {string} event
         * @param {*} [data]
         */
        function emit(event, data) {
            intercom.emit(event, data);
        }

        /**
         * Подписка на события intercom
         * @param {string} event
         * @param {function} callback
         */
        function on(event, callback) {
            intercom.on(event, callback);
        }

        /**
         * Отписка от события event функции callback
         * @param {string} event
         * @param {function} callback
         */
        function off(event, callback) {
            intercom.off(event, callback);
        }
    }

})();