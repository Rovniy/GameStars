(function () {
    'use strict';

    angular
        .module('gsadmin')
        .filter('currencyUnit', currencyUnit);

    function currencyUnit() {
        return currencyUnitFilter;

        ////////////////

        /**
         * @param {number} amount
         * @param {string} currencyType
         * @param {boolean} [round = false]
         */
        function currencyUnitFilter(amount, currencyType, round) {
            if (!angular.isNumber(amount)){
                return amount;
            }

            currencyType = currencyType || 'REAL_POINTS';
            round = !!round;

            switch (currencyType){
                case 'TOURNAMENT_POINTS':
                    return amount + ' Chips';
                
                case 'STAR_POINTS':
                    return amount + ' SP';

                case 'REAL_POINTS':
                    var value = amount / 100;

                    if (round) {
                        value = Math.round(value);
                    }
                    else {
                        value = value % 1 === 0 ? value : value.toFixed(2);
                    }

                    return '$ ' + value;

                default:
                    console.warn('Unknown currency type: ' + currencyType);
                    return;
            }
        }
    }

})();

