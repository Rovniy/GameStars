//Контроллер, который отвечает за вывод диалоговых окон подтверждения и отклонения матчей
gamestar.controller('iAmReadyForGame', function ($scope, $interval, $rootScope, $http, $uibModal) {
    $scope.beforePressAccept = true; //Ожидание момента нажатия кнопки "ГОТОВ" в первом диалоговом окне
    $scope.somebodyDecline = false; //Если кто-нибудь отклонил предложение
    $scope.waittime = 60000; //Время ожидания подтверждения
    $scope.linewidth = 100; //Сколько процентов масимального значения?
    $scope.reactUser1 = true; //Начальное положение

    $interval(function () {
        $scope.linewidthstep = 100 / ( $scope.waittime / 1000 );
        $scope.linewidth = $scope.linewidth - $scope.linewidthstep;
        if ($scope.linewidth == 0) {
        }
    }, 1000);

    // Функция при согласии с игрой
    $rootScope.acceptApp = function() {
        $scope.beforePressAccept = false;
        var currentUrl = $rootScope.rootUrl+ '/api/match/accept';
        var data = {
            room_id: $rootScope.room_id,
            application_id: $rootScope.application_id
        };
        $http.post(currentUrl, data, $rootScope.httpHandler);
    };

    // Реакция по нажатию на кнопку "Отмена" в окне "Матч найден!"
    $scope.cancelGame = function() {
        var currentUrl = $rootScope.rootUrl+ '/api/match/decline';
        var data = {
            application_id: $rootScope.application_id,
            room_id: $rootScope.room_id
        }
        $http.post(currentUrl, data, $rootScope.httpHandler);
        $rootScope.showNotification('IM_READY_FOR_GAME_NOTIFICATION__YOU_CANCEL_PARTICIPATION', 'information' );
        $rootScope.searchWindowClose();
        $rootScope.modalInstance.close($rootScope.selected);
    }

    // WS: Кто-то отменил свою ставку, наажав "Отмена"
    $scope.$on('APPLICATION_DECLINED', function(e, data){
        $rootScope.showNotification('IM_READY_FOR_GAME_NOTIFICATION__ONE_MEMBER_DECLINED', 'information' );
        //Закрываем текущее модальное коно
        $rootScope.modalInstance.close($rootScope.selected);
        //ОТкрываем новое окно и переспрашиваем
        $rootScope.modal = function (size, path) {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/src/html/modal/' + path,
                size: size,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
            });
        };
        $scope.$mygameready = true;
        if ($scope.$mygameready == true) {
            $scope.modal('sm', 'reaccept.html');
        }
    });

    // ID иконок в строке чека нажатия готовности
    $scope.usersCount1 = 1;
    $scope.usersCount2 = 2;
    $scope.usersCount3 = 3;
    $scope.usersCount4 = 4;
    $scope.usersCount5 = 5;
    $scope.usersCount6 = 6;
    $scope.usersCount7 = 7;
    $scope.usersCount8 = 8;
    $scope.usersCount9 = 9;
    $scope.usersCount10 = 10;

    // WS: При приеме количества пользователей, подтвердивших участие в игре
    $scope.$on('APPLICATION_ACCEPTED', function(e, data){
        $scope.usersaccepted = data.accepted_count;
    })
});

//Контроллер, который срабатывает, когда пользователь начинает искать игру.
gamestar.controller('findTheGameNow', function ($scope, $interval, $rootScope, $http) {
    // Кнопка отмены участия в игре
    $rootScope.application_disapply = function() {
        $rootScope.searchWindowClose();
        $rootScope.showNotification('FIND_GAME_NOTIFICATION__YOU_CANCELED_SEARCH', 'information' );
        window.sessionStorage.setItem('findCurrentTime', 0);
        $scope.timer = 0;
        //ЗДесь будет рест на отправку сообщения о закрытии окошка подбора матча
        var currentUrl = $rootScope.rootUrl+ '/api/match/disapply';
        var data = {
            application_id: $rootScope.application_id
        }
        $http.post(currentUrl, data, $rootScope.httpHandler);
    }

    // Чекаем сессию и смотрим, сколько времени натикало с момента поиска игры
    if (sessionStorage.getItem('findCurrentTime')) {
        $scope.timer = sessionStorage.getItem('findCurrentTime');
    } else {
        $scope.timer = 0;
    }
    $interval(function () {
        ++$scope.timer;
        $scope.hour = Math.floor($scope.timer / 3600);
        $scope.minute = Math.floor(( $scope.timer - $scope.hour * 3600) / 60);
        $scope.second = $scope.timer - $scope.hour * 3600 - $scope.minute * 60;
        if ($scope.hour < 10) $scope.hour = '0' + $scope.hour;
        if ($scope.minute < 10) $scope.minute = '0' + $scope.minute;
        if ($scope.second < 10) $scope.second = '0' + $scope.second;
        $scope.thetime = $scope.minute + ':' + $scope.second;
        //Запоминаем текущее время таймера
        window.onbeforeunload = function () {
            window.sessionStorage.setItem('findCurrentTime', $scope.timer);
        }
    }, 1000);


    // WS: Реакция на нажатие кнопки согласия участия в игре
    $scope.$on('APPLICATION_APPLIED', function(e, data){
        $scope.timer = 0;
        $scope.thetime = '00:00';
        $rootScope.searchWindowStart();
        $rootScope.application_id = data.application_id;
        $rootScope.showNotification('FIND_GAME_NOTIFICATION__YOU_START_TO_SEARCH', 'success' );
        $scope.timer = 0;
        $scope.hour = 0;
        $scope.minute = 0;
        $scope.second = 0;
    });
});

//Контроллер, который срабатывает, когда приходит запрос на подтверждение ставки от пользователя
gamestar.controller('reAcceptBit', function ($scope, $interval, $rootScope, $http) {
    //Согласиться поставить новую ставку
    $scope.acceptReAccept = function() {
        var currentUrl = $rootScope.rootUrl+ '/api/match/apply';
        $scope.reBit = localStorage.getItem('currentbit'); //Получение данных о текущей ставке
        $scope.reTourId = localStorage.getItem('currenttourId'); //Получение ID турнира
        var data = {
            bid: $scope.reBit,
            tournament_id: $scope.reTourId
        }
        $http.post(currentUrl, data).then(
            function successCallback(response) {
            }, function errorCallback(response) {
                if (response.data.error.type == 'NotPlayingTimeException') {
                    $rootScope.showNotification('FIND_GAME_NOTIFICATION__TIME_IS_OVER', 'information');
                } else if (response.data.error.type == 'AccountBlockException') {
                    $rootScope.showNotification('FINS_GAME_NOTIFICATION__ACCOUNT_BLOCKED', 'information');
                } else if (response.data.error.type == 'NotEnoughCostsException') {
                    $rootScope.showNotification('FINS_GAME_NOTIFICATION__YOU_LOOSED', 'information');
                } else {
                    $rootScope.showNotification('FIND_GAME_NOTIFICATION__ERROR', 'information');
                }
            });
        $rootScope.modalInstance.close($rootScope.selected); //Закрытие окна
    }

    //Нажатие на кнопку отмены
    $scope.cancelReAccept = function() {
        $rootScope.modalInstance.close($rootScope.selected);
    }
});