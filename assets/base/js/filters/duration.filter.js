(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .filter('duration', duration);

    function duration() {
        return durationFilter;

        ////////////////

        //TODO: format
        function durationFilter(seconds) {
            if (!angular.isNumber(seconds)){
                return;
            }

            var duration = moment.duration(seconds, 'seconds');
            
            return pad(duration.hours()) + ':' + pad(duration.minutes()) + ':' + pad(duration.seconds());
        }

        /**
         * @param {number} value
         * @return {string}
         */
        function pad(value) {
            return value > 9 ? '' + value : '0' + value;
        }
    }

})();

