angular.module('gsadmin').filter('transaction', function(){
    return function (value, currencyType, action){
        if (angular.isUndefined(value)){
            return '';
        }

        var a = '';

        if (action) {
            a = (action === 'DEC') ? '-' : '+';
        }
        
        switch (currencyType){
            case 'TOURNAMENT_POINTS':
                return a + value + ' Chips';

            case 'STAR_POINTS':
                return a + value +' SP';

            case 'REAL_POINTS':
                return a + '$ ' + (value / 100).toFixed(2);

            default:
                console.warn('Unknown currency type: ' + currencyType);
                break;
        }
    }
});