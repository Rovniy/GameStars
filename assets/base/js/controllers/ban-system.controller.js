(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('BanSystemController', BanSystemController);

    BanSystemController.$inject = ['$scope', '$interval', 'modalData'];

    /* @ngInject */
    /**
     * @param {angular.IRootScopeService} $scope
     * @param {angular.IIntervalService} $interval
     * @param {{type: string, timeout: number}} modalData
     * @constructor
     */
    function BanSystemController($scope, $interval, modalData) {
        var vm = this;
        var ban = modalData;
        var duration;
        
        vm.timer = undefined;
        vm.resolve = undefined;
        vm.reason = undefined;

        activate();
        
        ////////////////

        function activate() {
            switch (ban.type) {
                case 'LEAVER_INGAME':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_LEAVER_INGAME';
                    break;
                case 'LEAVER_LOBBY':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_LEAVER_LOBBY';
                    break;
                case 'LEAVER_PORTAL':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_LEAVER_PORTAL';
                    break;
                case 'LEAVER_PICK':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_LEAVER_PICK';
                    break;
                case 'LEAVER_MATCHED_WINDOW':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_LEAVER_MATCHED_WINDOW';
                    break;
                case 'SMURFING':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_SMURFING';
                    break;
                case 'СOLLUSION':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_СOLLUSION';
                    break;
                case 'FEEDER':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_FEEDER';
                    break;
                case 'AFK':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_AFK';
                    break;
                case 'CHEATER':
                    vm.resolve = 'ALERT__ACTION_VIOLATION_TYPE_CHEATER';
                    break;
                case 'CUSTOM':
                    vm.reason = ban.reason;
                    break;
                default:
                    break;
            }

            duration = moment.duration(ban.timeout, 'seconds');

            var promise = formatTimer() || $interval(interval, 1000, ban.timeout);

            $scope.$on('$destroy', function () {
                $interval.cancel(promise);
            });
        }

        function interval() {
            duration.subtract(1, 'seconds');
            formatTimer();
        }

        function formatTimer() {
            vm.timer = _pad(duration.hours()) + ':' + _pad(duration.minutes()) + ':' + _pad(duration.seconds());
        }

        /**
         * @param value
         * @return {string}
         * @private
         */
        function _pad(value) {
            return value > 9 ? '' + value : '0' + value;
        }
    }

})();