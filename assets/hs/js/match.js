//Контроллер, который отвечает за старт матча и за страницу матча.
gamestar.controller('matchStart', function ($scope, $http, $interval, $rootScope ) {
    $scope.iAmReady = false; //Нажата ли кнопка "ГОТОВ"
    $scope.addSometime = false; //Если приходит "дополнительное время"
    $scope.allUsersAccept = false; //Если все приняли игру и нажали готов, то ставим true и скрывается чат и появляется ссылка для подключени
    $scope.allUsersAcceptFunction = function(data) {
        $scope.allUsersAccept = data;
    }
    $scope.matchStartedInfo = true; //Отображаем инфу о матче, но через 2 мин скрываем и показываем кнопки о результатах
    $scope.showcopyarea = 0; //Показывать или нет поле со ссылкой на турнир
    $scope.showcopyarea = false;  //Показывать ли ссылку на игру

    //Получение значения ROOM_ID из локального хранилища
    $scope.roomId = localStorage.getItem('roomId');

    $http.get('/api/profile').then(function successCallback(response) {
        if (response.data.data.options.actualMatches) {
            response.data.data.options.actualMatches.forEach(function(f) {
                if (f.id) {
                    $rootScope.status = f.status;
                    localStorage.setItem('roomId', f.id);
                }
            })
        }
        if($rootScope.status=='STARTED'){
            $scope.allUsersAcceptFunction(true);
            console.log($scope.allUsersAccept);
        }
    }, function errorCallback(response) {

    });

    //Формирование для REST запроса и получения из него данных
    $scope.roomUrl = '/api/match/' + $scope.roomId + '/lobby';
    $http.get($scope.roomUrl).then(function successCallback(fromGet) {
        $rootScope.match_id = fromGet.data.data.match_id;
        $scope.bet = fromGet.data.data.bet;
        $scope.countdown = fromGet.data.data.countdown;
        $scope.info = fromGet.data.data.match_info;
        $scope.linkurl = fromGet.data.data.url_link;
        localStorage.setItem('playurl', $scope.linkurl);

        //Вызываем дополнительное время при перезагрузке
        if (fromGet.data.data.delayed == true) {
            $scope.startAddTime(fromGet.data.data);
        }
        if (fromGet.data.data.team_one.rank) {
            $scope.myTeam = fromGet.data.data.team_one;
            $scope.enemyTeam = fromGet.data.data.team_two;
        } else {
            $scope.enemyTeam = fromGet.data.data.team_one;
            $scope.myTeam = fromGet.data.data.team_two;
        }
        $scope.playmap = $scope.info.map; //Выяснение карты для игры
        if ($scope.playmap == 11)
            $scope.playmap = $rootScope.translate('Ущелье призывателей');
        $scope.format = $scope.info.team_size; //Размер команды
        if ($scope.format == 5)
            $scope.format = '5х5';
        $scope.rezim = $scope.info.mode; //Игровой режим
        if ($scope.rezim == 'tournament')
            $scope.rezim = 'Турнир';
        $scope.type = $scope.info.bet_type; //Тип ставки
        if ($scope.type == 'STACK')
            $scope.type = 'Игра на фишки';

        var remain_bv = $scope.countdown; //Счетчик начала матча

        //Таймер счетчика
        function matchStartTime(timestamp){
            if (timestamp < 0) timestamp = 0;
            $scope.hour = Math.floor(timestamp/60/60);
            $scope.mins = Math.floor((timestamp - $scope.hour*60*60)/60);
            $scope.secs = Math.floor(timestamp - $scope.hour*60*60 - $scope.mins*60);
            if(String($scope.mins).length == 1)
                $scope.mins = '0' + $scope.mins;
            if(String( $scope.secs).length == 1)
                $scope.secs = '0' + $scope.secs;
        }
        $interval(function(){
            remain_bv = remain_bv - 1;
            matchStartTime(remain_bv);
            if(remain_bv <= 0){
            }
        }, 1000, remain_bv);

    }, function errorCallback(fromGet) {
    });

    // Если пришло дополнительное время ожидания
    $scope.startAddTime = function(data) {

        $scope.addSometime=true;
        var addtimer = data.countdown; //Счетчик начала матча

        //Таймер счетчика
        function addWaitTime(timestamp){
            if (timestamp < 0) timestamp = 0;
            $scope.addhour = Math.floor(timestamp/60/60);
            $scope.addmins = Math.floor((timestamp - $scope.addhour*60*60)/60);
            $scope.addsecs = Math.floor(timestamp - $scope.addhour*60*60 - $scope.addmins*60);
            if(String($scope.addmins).length == 1)
                $scope.addmins = '0' + $scope.addmins;
            if(String( $scope.addsecs).length == 1)
                $scope.addsecs = '0' + $scope.addsecs;
        }
        $interval(function(){
            addtimer = addtimer - 1;
            addWaitTime(addtimer);
            if(addtimer <= 0){
            }
        }, 1000, addtimer);
    }

    // Поведение нажатия на кнопку ГОТОВ
    $scope.userReady = function(){
        $scope.iAmReady = true; //Меняем внешний вид кнопки
        var currentUrl = $rootScope.rootUrl+ '/api/match/confirm';
        var data = {
            room_id: localStorage.getItem('roomId')
        }
        $http.post(currentUrl, data, $rootScope.httpHandler);
    };

    // Поведение нажатия на кнопку ГОТОВ
    $scope.matchFinish = function(win){
        $scope.userChoosed = true; //Меняем внешний вид кнопки
        var currentUrl = $rootScope.rootUrl+ '/api/match/result/manual';
        var data = {
            room_id: localStorage.getItem('roomId'),
            result: win
        }
        $http.post(currentUrl, data, $rootScope.httpHandler);
    };

    $scope.sendMsg = function(){
        console.log('msgText: ', $scope.msgText);
        $rootScope.$broadcast('TO_SERVER', {message_type: 'CHAT', msg: $scope.msg, room_id: $rootScope.room_id});
    };

    //Получение ссылк на игру
    $scope.getGameLink = function() {
        $scope.showcopyarea = true;
        $rootScope.modalAlert('sm', 'copy-complate.html');
        setTimeout(function(){
            $scope.btnGetReferal = true;
        }, 500);
    };

    // Если приходит сигнал готовности игрока к игре
    $scope.$on('MATCH_ACCEPTED', function(e, data){
            localStorage.setItem('roomId', data.match_id);
        var player_name = data.player_name;
        [$scope.myTeam, $scope.enemyTeam].forEach(function(team){
            team.forEach(function(player){
                if (player.name===player_name) player.is_ready = true;
            })
        })
    });

    // Приходит сигнал на дополнительное время
    $scope.$on('MATCH_TIME_UP', function(e, data){
        $rootScope.showNotification('MATCH_NOTIFICATION__TIME_UP', 'information' );
        $scope.startAddTime(data);
    });

    // Если сервер прислал сигнал о окончании матча и расформировании комнаты
    $scope.$on('MATCH_DESTROYED', function(e, data){
        $rootScope.showNotification('MATCH_NOTIFICATION__ANOTHER_PLAYER_IS_OFFLINE', 'error' );
        $rootScope.modalInstance.close($rootScope.selected);
    });

    $scope.timeWaitForBut = 420000;
    $interval(function(){
        $scope.matchStartedInfo = false;
    }, $scope.timeWaitForBut, 1);

    // Если пришел сигнал о начале игры. Все подтвердили и все отлично!
    $scope.$on('MATCH_STARTED', function(e, data){
        localStorage.setItem('roomId', data.match_id);
        $rootScope.showNotification('MATCH_NOTIFICATION__MATCH_LAUNCHED', 'information' );
        $scope.allUsersAccept = true;
        //Время ожидания перехода на кнопки результатов игры
        $scope.matchStartedInfo = true;
        $scope.timeWaitForBut = 420000;
        $interval(function(){
            $scope.matchStartedInfo = false;
        }, $scope.timeWaitForBut, 1);
    });

    // Завершилась игра, показываем результаты
    $scope.$on('MATCH_FINISH', function(e, data){
        $rootScope.status = 'FINISHED';
            localStorage.setItem('roomId', data.match_id);
    });

});

//Контроллер, который отвечает за вывод результатов матча
gamestar.controller('matchResult', function ($scope, $http, $interval, $rootScope) {
    $scope.closeResultWindow = function() {
        $rootScope.modalInstance.close($rootScope.selected);
    }

    // Завершилась игра, показываем результаты
    if ($rootScope.status == 'FINISHED') {
        $scope.playurl = localStorage.getItem('playurl');
        $http.get('/api/profile').then(function successCallback(response) {
            if (response.data.data.options.actualMatches[0]) {
                $rootScope.status = response.data.data.options.actualMatches[0].status;
                //Текущий уровень пользователя
            }
            $scope.currentlvl = response.data.data.level;
        }, function errorCallback(response) {
        });

        $scope.roomId = localStorage.getItem('roomId'); //Получение ID комнаты
        $scope.roomUrl = '/api/match/' + $scope.roomId + '/result';
        $http.get($scope.roomUrl).then(function successCallback(fromGet) {
            $scope.match_id = fromGet.data.match_id;
            $scope.bet = fromGet.data.data.bet;
            $scope.duration = fromGet.data.data.duration;
            $scope.durationHour = Math.floor($scope.duration / 60 / 60);
            $scope.durationMin = Math.floor(($scope.duration - $scope.durationHour *60*60)/60);
            $scope.durationSec = Math.floor(($scope.duration - $scope.durationHour *60*60) - $scope.durationMin*60);
            if ($scope.durationHour > 0) {
                $scope.playTime = $scope.durationHour + ':' + $scope.durationMin + ':' + $scope.durationSec;
            } else {
                $scope.playTime = $scope.durationMin + ':' + $scope.durationSec;
            }
            // Определение результатов
            if (fromGet.data.player_result) {
                $scope.mayBeWin = fromGet.data.data.player_result.is_win; //Какой статус у меня? Выиграл ли я или проиграл?
                $scope.exp = fromGet.data.data.player_result.exp; //Сколько опыта пришло из запроса results.exp
                $scope.exp_delta = fromGet.data.data.player_result.exp_delta; //Сколько опыта добавилось из запроса results.exp_delta
            }

            // Определение, в какой я команде
            if (fromGet.data.data.team_one) {
                $scope.myTeam = fromGet.data.data.team_one;
                $scope.enemyTeam = fromGet.data.data.team_two;
            }

            // Полученные полные результаты матча
            if ($rootScope.status == 'COMPLITED') {
                $scope.hideAddTimer = true;
            }

            $scope.borderleft = 0; //Переменная, включающая измененное отображение полос оптыа

            if ($scope.exp + $scope.exp_delta > 100 ){
                $scope.exp_delta = $scope.exp + $scope.exp_delta - 100;
                $scope.exp = 0;
                $scope.borderleft = 1;
                $scope.currentlvl++;
            };

            // Счетчик начала матча
            var remain_bv = $scope.countdown;

            //Таймер счетчика
            function matchStartTime(timestamp){
                if (timestamp < 0) timestamp = 0;
                $scope.hour = Math.floor(timestamp/60/60);
                $scope.mins = Math.floor((timestamp - $scope.hour*60*60)/60);
                $scope.secs = Math.floor(timestamp - $scope.hour*60*60 - $scope.mins*60);
                if(String($scope.mins).length == 1)
                    $scope.mins = '0' + $scope.mins;
                if(String( $scope.secs).length == 1)
                    $scope.secs = '0' + $scope.secs;
            }
            $interval(function(){
                remain_bv = remain_bv - 1;
                matchStartTime(remain_bv);
                if(remain_bv <= 0){
                }
            }, 1000);


        }, function errorCallback(fromGet) {
            //todo: отрефакторить?
            $scope.match = window.i18n[$rootScope.currentLanguage]['MATCH_NOTIFICATION__SERVER_ERROR'];
        });

    };

    // Получили результаты
    if ($rootScope.status == 'COMPLITED') {
        $http.get('/api/profile').then(function successCallback(response) {
            if (response.data.data.options.actualMatches[0]) {
                $rootScope.status = response.data.data.options.actualMatches[0].status;
            }
            $scope.currentlvl = response.data.data.level;
        }, function errorCallback(response) {
        });

        //Получение ID комнаты
        $scope.roomId = localStorage.getItem('roomId');
        $scope.roomUrl = '/api/match/' + $scope.roomId + '/result';
        $http.get($scope.roomUrl).then(function successCallback(fromGet) {
            $scope.match_id = fromGet.data.data.match_id;
            $scope.betaward = fromGet.data.data.player_result.award;
            $scope.duration = fromGet.data.data.duration;
            $scope.durationHour = Math.floor($scope.duration / 60 / 60);
            $scope.durationMin = Math.floor(($scope.duration - $scope.durationHour *60*60)/60);
            $scope.durationSec = Math.floor(($scope.duration - $scope.durationHour *60*60) - $scope.durationMin*60);
            if ($scope.durationMin<9) {
                $scope.durationMin = '0' + $scope.durationMin;
            }
            if ($scope.durationSec<9) {
                $scope.durationSec = '0' + $scope.durationSec;
            }
            if ($scope.durationHour > 0) {
                $scope.playTime = $scope.durationHour + ':' + $scope.durationMin + ':' + $scope.durationSec;
            } else {
                $scope.playTime = $scope.durationMin + ':' + $scope.durationSec;
            }
            //Определение результатов
            if (fromGet.data.data.player_result) {
                $scope.mayBeWin = fromGet.data.data.player_result.is_win; //Какой статус у меня? Выиграл ли я или проиграл?
                $scope.exp = fromGet.data.data.player_result.exp; //Сколько опыта пришло из запроса results.exp
                $scope.exp_delta = fromGet.data.data.player_result.exp_delta; //Сколько опыта добавилось из запроса results.exp_delta
            }

            // Определение, в какой я команде
            if (fromGet.data.data.team_one) {
                $scope.myTeam = fromGet.data.data.team_one;
                $scope.enemyTeam = fromGet.data.data.team_two;
            }

            // Полученные полные результаты матча
            if ($rootScope.status == 'COMPLITED') {
                $scope.hideAddTimer = true;
            }

            // Переменная, включающая измененное отображение полос оптыа
            $scope.borderleft = 0;

            if ($scope.exp + $scope.exp_delta > 100 ){
                $scope.exp_delta = $scope.exp + $scope.exp_delta - 100;
                $scope.exp = 0;
                $scope.borderleft = 1;
                $scope.currentlvl++;
            };

            // Счетчик начала матча
            var remain_bv = $scope.countdown;

            // Таймер счетчика
            function matchStartTime(timestamp){
                if (timestamp < 0) timestamp = 0;

                $scope.hour = Math.floor(timestamp/60/60);
                $scope.mins = Math.floor((timestamp - $scope.hour*60*60)/60);
                $scope.secs = Math.floor(timestamp - $scope.hour*60*60 - $scope.mins*60);

                if(String($scope.mins).length == 1)
                    $scope.mins = '0' + $scope.mins;
                if(String( $scope.secs).length == 1)
                    $scope.secs = '0' + $scope.secs;
            }
            $interval(function(){
                remain_bv = remain_bv - 1;
                matchStartTime(remain_bv);
                if(remain_bv <= 0){
                }
            }, 1000);
        }, function errorCallback(fromGet) {
            $scope.match = 'Ошибка получения данных с сервера. Обратитесь к администратору';
        });
    };
});