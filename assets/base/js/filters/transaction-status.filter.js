(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .filter('tStatus', tStatus);

    function tStatus() {
        var map = {
            COMPLETED: 'TRANSACTION_STATUS__COMPLETED',
            PROCESS: 'TRANSACTION_STATUS__PROCESS',
            CREATED: 'TRANSACTION_STATUS__PROCESS'
        };

        return tStatusFilter;

        ////////////////
        
        function tStatusFilter(status) {
            return map[status] || status;
        }
    }

})();

