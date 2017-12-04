angular.module('gsadmin').filter('createdBy', function(){
    var map = {
        USER: 'пользователь',
        ADMIN: 'админ',
        SYSTEM: 'система'
    };

    return function(data){
        return map[data] || data;
    };
});