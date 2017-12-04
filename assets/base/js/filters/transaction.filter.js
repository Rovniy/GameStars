(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .filter('transaction', transaction);

    function transaction() {
        return transactionFilter;

        ////////////////

        function transactionFilter(value, currencyType, action) {
            var a = '';

            if (action) {
                a = (action === 'DEC') ? '-' : '+'; //todo
            }

            switch (currencyType){
                case 'TOURNAMENT_POINTS':
                    return a + value + ' Chips';

                case 'STAR_POINTS':
                    return a + value + ' SP';

                case 'REAL_POINTS':
                    return a + '$ ' + (value / 100).toFixed(2);

                default:
                    return;
            }
        }
    }

})();

