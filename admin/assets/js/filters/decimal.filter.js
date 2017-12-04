angular.module('gsadmin').filter('decimal', function() {
    return function(num) {
        if (!angular.isNumber(num)) return '-';

        return (Math.round(num * 100) / 100);
    };
});