var test = {
    "match": {}
};

test.getRootScope = function(){
    var $body = angular.element(document.getElementsByTagName('html')[0]);
    return $body.scope().$root;
};

test.getUserPorfile = function(){
    test.getRootScope().getUserProfile();
};

test.sendTestMsg = function(m){
    // test.getRootScope().$broadcast(m.message_type, m);
    Intercom.getInstance().emit('incoming', m);
};

test.sendTestMsgGenerator = function(msg){
    return function(){
        test.sendTestMsg(msg);
    }
};

test.toServer = function(msg){
    if (typeof msg ==='string') msg = {msg: msg};
    msg.message_type = 'TO_SERVER';
    console.log('toServer msg: ', msg);
    test.sendTestMsg(msg)
};
// Тестирование сценария MM
test.applied = test.sendTestMsgGenerator({message_type: 'APPLICATION_APPLIED', application_id: 42}); //Начался подбор игроков - появляется окно в хедере
test.applicationMatched = test.sendTestMsgGenerator({message_type: 'APPLICATION_MATCHED', application_id: 42, match_id: '69076c1a-f507-4577-ade0-3916923da760'}); //подбор окончен, сформированны команды, нужно подтвердить готовность. Появляется модальное окно подбора
test.applicationDeclined = test.sendTestMsgGenerator({message_type: 'APPLICATION_DECLINED'}); //Один из участников отменил готовноть. Зыкрываем модальное окно
test.applicationAccepted = test.sendTestMsgGenerator({message_type: 'APPLICATION_ACCEPTED', accepted_count: 1}); //приходит инфо о количестве подтвержденных участников в игре. Отображаем иконки готовых юзеров
test.applicationTimeOut = test.sendTestMsgGenerator({message_type: 'APPLICATION_TIMEOUT'}); //Вышло время подбора участников. Закрываем окно поиска в хедере
test.applicationRoomTimeOut = test.sendTestMsgGenerator({message_type: 'APPLICATION_ROOM_TIMEOUT'}); //Вышло время подбора участников. Закрываем окно поиска в хедере
test.applicationRangeUp = test.sendTestMsgGenerator({message_type: 'APPLICATION_RANGEUP'}); //Расширился диапазон поиска. Ничего не делаем
test.applicationBroken = test.sendTestMsgGenerator({message_type: 'APPLICATION_BROKEN'}); //Расширился диапазон поиска. Ничего не делаем
test.matchCreated = test.sendTestMsgGenerator({message_type: 'MATCH_CREATED', match_id: '69076c1a-f507-4577-ade0-3916923da760'});
test.matchUserready3 = test.sendTestMsgGenerator({message_type: 'MATCH_ACCEPTED', player_name: 'Test3'});
test.matchTtimeUp = test.sendTestMsgGenerator({message_type: 'MATCH_TIME_UP', match_id: '69076c1a-f507-4577-ade0-3916923da760', countdown: 59}); //Приходит сигнал ,если один из пользователей оффлайн, но кончилось время
test.matchDESTROYED = test.sendTestMsgGenerator({message_type: 'MATCH_DESTROYED'});
test.matchSTARTED = test.sendTestMsgGenerator({message_type: 'MATCH_STARTED'});
test.matchAccepted = test.sendTestMsgGenerator({message_type: 'MATCH_ACCEPTED'});
test.matchEnded = test.sendTestMsgGenerator({message_type: 'MATCH_FINISH', match_id: '69076c1a-f507-4577-ade0-3916923da760'});
test.matchResultOK = test.sendTestMsgGenerator({message_type: 'MATCH_RESULTS_RECEIVED', match_id: '69076c1a-f507-4577-ade0-3916923da760'});

// Тестирование сокетов
test.socketDisconnected = test.sendTestMsgGenerator({message_type: 'SOCKET_DISCONNECTED'});
test.socketConnectedAgain = test.sendTestMsgGenerator({message_type: 'SOCKET_CONNECTED_AGAIN'});

// Тестирование интерфейсов MM

test.match.created = test.sendTestMsgGenerator({message_type: 'MATCH_CREATED', test: 'frontTest', match_id: '69076c1a-f507-4577-ade0-3916923da760'});


test.violationTest = test.sendTestMsgGenerator({message_type: 'VIOLATION_CREATED', 'money_count': 111, 'violation_type': 'LEAVER_INGAME', 'user_name': 'Ravy', 'expire_time': 300, 'reported_by': 'xPloit', 'users_group': 'Offender', 'reported_name': ''});

// Вызов мультика первой сессии о выигрыше или проигрыше первой игры
test.multikFirstWin = test.sendTestMsgGenerator({message_type: 'MATCH_FIRST_FOR_USER', 'win': true});
test.multikFirstLose = test.sendTestMsgGenerator({message_type: 'MATCH_FIRST_FOR_USER', 'win': false});