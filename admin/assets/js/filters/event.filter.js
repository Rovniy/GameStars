angular.module('gsadmin').filter('event', function(){
    var map = {
        BUY_TOURNAMENT_CHIPS: 'Покупка фишек турнира',
        TOURNAMENT_REGISTRATION: 'Регистрация в турнире',
        TAKE_MATCH_BID: 'ставка на матч',
        RETURN_MATCH_BID: 'возвращение ставки на матч',
        RETURN_OFFLINE_BIDS_PART: 'Возврат ставок',
        TRANSFER_AWARD: 'Награждение',
        PENALTY: 'наказание',
        RECALCULATION: 'пересчет',
        MATCH_CANCELED: 'матч отменен',
        REFFERAL_BONUS: 'бонус за реферала',
        BONUS: 'Бонус',
        CONVERSION: 'Конвертация',
        COMMISSION: 'Комиссия',
        MONEY_WITHDRAWAL: 'Вывод денег',
        PROMO_BONUS: 'Промо бонус'
    };

    return function (event){
        return map[event];
    }
});