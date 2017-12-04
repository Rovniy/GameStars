(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .filter('matchStatus', matchStatus);

    function matchStatus() {
        return matchStatusFilter;

        ////////////////

        function matchStatusFilter(status) {
            switch (status) {
                case "FINISH":
                    return 'TOUR_LIST__FINISHED';

                case 'INACTIVE':
                //return 'TOURNAMENT__REG_START_ON';
                case 'PRE_REG':
                    return 'TOUR_LIST__REG_NOW';

                case 'POST_REG':
                    return 'TOUR_LIST__START';

                case 'START':
                    return 'TOUR_LIST__ACTIVE';

                default:
                    console.error('matchStatus error: ', status);
                    return '';
            }
        }
    }

})();

