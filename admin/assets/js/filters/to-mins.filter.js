//приведение времени в секундах в цифровой формат
angular.module('gsadmin').filter('toMins', function(){
    return function (rawSec){
        var sec = rawSec%60;
        var mins = Math.floor(rawSec/60);
        var hours = Math.floor(mins/60);
        var norm = function(num){
            return num<10?'0'+num: num+'';
        };
        var res = norm(hours)+':'+norm(mins )+ ':' + norm(sec )+ ' ';
        return res;

    }
});