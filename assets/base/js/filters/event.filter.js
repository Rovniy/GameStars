(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .filter('event', event);

    function event() {
        var map = {
            BUY_TOURNAMENT_CHIPS: 'TRANSACTION_EVENT__BUY_TOURNAMENT_CHIPS',
            TOURNAMENT_REGISTRATION: 'TRANSACTION_EVENT__TOURNAMENT_REGISTRATION',
            TAKE_MATCH_BID: 'TRANSACTION_EVENT__TAKE_MATCH_BID',
            RETURN_MATCH_BID: 'TRANSACTION_EVENT__RETURN_MATCH_BID',
            RETURN_OFFLINE_BIDS_PART: 'TRANSACTION_EVENT__RETURN_OFFLINE_BIDS_PART',
            TRANSFER_AWARD: 'TRANSACTION_EVENT__TRANSFER_AWARD',
            PENALTY: 'TRANSACTION_EVENT__PENALTY',
            RECALCULATION: 'TRANSACTION_EVENT__RECALCULATION',
            MATCH_CANCELED: 'TRANSACTION_EVENT__MATCH_CANCELED',
            REFFERAL_BONUS: 'TRANSACTION_EVENT__REFFERAL_BONUS',
            BONUS: 'TRANSACTION_EVENT__BONUS',
            CONVERSION: 'TRANSACTION_EVENT__CONVERSION',
            COMMISSION: 'TRANSACTION_EVENT__COMMISSION',
            MONEY_WITHDRAWAL: 'TRANSACTION_EVENT__MONEY_WITHDRAWAL',
            PROMO_BONUS: 'TRANSACTION_EVENT__PROMO_BONUS',
            ADDON_TOURNAMENT_CHIPS: 'TRANSACTION_EVENT__ADDON_TOURNAMENT_CHIPS'
        };

        return eventFilter;

        ////////////////

        function eventFilter(event) {
            return map[event] || event;
        }
    }

})();

