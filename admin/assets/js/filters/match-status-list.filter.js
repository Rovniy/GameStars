angular.module('gsadmin').filter('matchStatusList', function() {
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
	};

	return function (status){
		return map[status] || status;
	}
});