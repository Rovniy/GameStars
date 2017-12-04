angular.module('gsadmin').filter('matchStatus', function(){
    var map = {
        CREATED: 'OK',
        PREPARE: 'OK',
        STARTED: 'OK',
        FINISHED: 'OK',
        COMPLETED: 'OK',
        COMPLETED_WITH_VIOLATION: 'ОК',
        NOT_FOUND_STAT: 'ОК',
        CANCELED: 'ОК',
        NOT_MATCHED: 'ОК',
        BAD_RESULT: 'Ожидает модерации'
        // START: 'OK',
        // FINISH: 'OK',
        // INACTIVE: 'OK',
        // PRE_REG: 'OK'
    };

    return function(status){
        return map[status] || status;
    };
});