angular.module('gsadmin').filter('tStatus', function(){
    var map = {
        COMPLETED: 'Завершен',
        PROCESS: 'В процессе',
        CREATED: 'Создан'
    };
    
    return function (status){
        return map[status] || status;
    }
});