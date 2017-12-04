angular.module('gsadmin').filter('matchResult', function(){
    var map = {
        CREATED: 'Матч создан',
        PREPARE: 'Идет игра',
        STARTED: 'Матч запущен',
        FINISHED: 'Ожидается статистика',
        COMPLETED: 'Завершен',
        COMPLETED_WITH_VIOLATION: 'Окончен с нарушениями',
        NOT_FOUND_STAT: 'Не найдена статистика',
        CANCELED: 'Матч отменен',
        NOT_MATCHED: 'Матч не состоялся',
        BAD_RESULT: 'Неверная статистика'
    };
    
    return function(status) {
        return map[status] || status;
    }
});