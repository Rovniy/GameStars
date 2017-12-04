(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('MatchStartController', MatchStartController);

    MatchStartController.$inject = ['$scope', '$http', '$interval', 'Analytics', 'config', '$translate', 'notificationService', 'modalService', 'socketService', 'modalData'];

    /* @ngInject */
    /**
     * Контроллер, который отвечает за старт матча и за страницу матча
     * @param $scope
     * @param $http
     * @param $interval
     * @param {Analytics} Analytics
     * @param {config} config
     * @param {angular.translate.ITranslateService} $translate
     * @param {notificationService} notificationService
     * @param {modalService} modalService
     * @param {socketService} socketService
     * @param {*} modalData
     * @constructor
     */
    function MatchStartController($scope, $http, $interval, Analytics, config, $translate, notificationService, modalService, socketService, modalData) {
        var vm = this;
        var clipboard = null;

        $scope.iAmReady = false; //Нажата ли кнопка "ГОТОВ"
        $scope.addSometime = false; //Если приходит "дополнительное время"
        $scope.allUsersAccept = false; //Если все приняли игру и нажали готов, то ставим true и скрывается чат и появляется ссылка для подключени
        $scope.showcopyarea = false;  //Показывать ли ссылку на игру
        $scope.room_id = localStorage.getItem('roomId'); //Получение значения ROOM_ID из локального хранилища
        $scope.status = modalData.status || undefined;
        $scope.cancel_reason = modalData.cancel_reason || '';

        $scope.startAddTime = startAddTime;
        $scope.userReady = userReady;
        $scope.matchFinish = matchFinish;
        $scope.sendMsg = sendMsg;
        $scope.openIssueModal = openIssueModal;
        $scope.onCopyGameLinkClick = onCopyGameLinkClick;

        activate();

        ////////////////

        function activate() {
            //Получаем список текущих матчей
            $http
                .get('/api/' + config.template + '/match/status/user')
                .then(onActualMacthGetComplete)
                .then(initClipboard);

            // Если приходит сигнал готовности игрока к игре
            $scope.$on('MATCH_ACCEPTED', function(e, data){
                localStorage.setItem('roomId', data.match_id);
                var player_name = data.player_name;
                [$scope.myTeam, $scope.enemyTeam].forEach(function(team){
                    team.forEach(function(player){
                        if (player.name.toUpperCase()===player_name.toUpperCase()) player.is_ready = true;
                    })
                })
            });

            // Приходит сигнал на дополнительное время
            $scope.$on('MATCH_TIME_UP', function(e, data){
                notificationService.info('MATCH_NOTIFICATION__TIME_UP');
                $scope.startAddTime(data);
            });

            //TODO ВОТ ТУТ ЗАПИЛИТЬ ПОКАЗ КНОПКИ ЗАВЕРШЕНИЯ МАТЧА, ПРИКРЕПЛЕННЫЙ К ВРЕМЕНИ СОЗДАНИЯ
            //
             /*$scope.timeWaitForBut = 500;
             $timeout(function(){
                 console.log('1231231');
             }, $scope.timeWaitForBut, 1);*/

            // Если пришел сигнал о начале игры. Все подтвердили и все отлично!
            $scope.$on('MATCH_STARTED', function(e, data){
                localStorage.setItem('roomId', data.match_id);
                notificationService.info('MATCH_NOTIFICATION__MATCH_LAUNCHED');
                $scope.allUsersAccept = true;
            });
        }

        function onActualMacthGetComplete(response) {
            if (response.data.actualMatchApplications.length > 0) {
                localStorage.setItem('application_id', response.data.actualMatchApplications[0].id);
            }

            //Если хоть 1 матч есть, то находим ID текущего матча
            if (response.data.actualMatches.length > 0) {
                $scope.status = response.data.actualMatches[0].status;
                if (response.data.actualMatches[0]) {
                    localStorage.setItem('roomId', response.data.actualMatches[0].id);
                }
                $scope.roomId = response.data.actualMatches[0].id;

                //Получаем данные текущего матча
                $scope.roomUrl = '/api/' + config.template + '/match/' + $scope.roomId + '/lobby';
                $http
                    .get($scope.roomUrl)
                    .then(function (fromGet) {
                        $scope.bet = fromGet.data.data.bet;
                        $scope.info = fromGet.data.data.match_info;
                        $scope.betType = $scope.info.bet_type;
                        $scope.linkurl = fromGet.data.data.url_link;

                        Analytics.trackEvent('match', 'lobby_show', '', {
                            bet: $scope.bet,
                            matchId: $scope.roomId,
                            type: localStorage.getItem('gameType'),
                            betType: localStorage.getItem('currencyType'),
                            tourId: localStorage.getItem('currenttourId'),
                            server: localStorage.getItem('currenttourRegion')
                        });

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
                        if ($scope.playmap == 11) {
                            $scope.playmap = 'MATCH_RESULT__SUMMONER_RIFT';
                        }
                        $scope.format = $scope.info.team_size; //Размер команды

                        $scope.rezim = $scope.info.mode; //Игровой режим
                        if ($scope.rezim == 'tournament') {
                            $scope.rezim = 'PUBLIC__PLAY_IN_TOURNAMENT';
                        } else if ($scope.rezim == 'cash') {
                            $scope.rezim = 'PUBLIC__PLAY_IN_CASHGAME';
                        }
                        $scope.type = $scope.info.bet_type; //Тип ставки
                        if ($scope.type == 'TOURNAMENT_POINTS') {
                            $translate('MATCH__GAME_WITH_STACK', function(text){
                                $scope.type = text;
                            });
                        }
                        $scope.regionGame = $scope.info.game_region; //Тип ставки

                        var seconds = fromGet.data.data.countdown;
                        var duration = moment.duration(seconds, 'seconds');
                        //Счетчик начала матча
                        function matchStartTime(){
                            $scope.mins = _pad(duration.minutes());
                            $scope.secs = _pad(duration.seconds());
                        }

                        matchStartTime();

                        $interval(function () {
                            duration.subtract(1, 'seconds');
                            matchStartTime()
                        }, 1000, seconds);
                    });
            }

            if($scope.status === 'STARTED'){
                timerButtonShow(1000);
                $scope.allUsersAccept = true;
            }
        }

        function initClipboard() {
            clipboard = new Clipboard('#copyGameLink', {
                text: function() {
                    return $scope.linkurl;
                }
            });

            clipboard.on('success', function() {
                notificationService.success('MATCH__LINK_COPIED');
            });

            $scope.$on('$destroy', function () {
                clipboard.destroy();
            });
        }

        // Если пришло дополнительное время ожидания
         function startAddTime(data) {
            $scope.addSometime = true;
            var seconds = data.countdown; //Счетчик начала матча
            var duration = moment.duration(seconds, 'seconds');

            //Таймер счетчика
            function addWaitTime(){
                $scope.addmins = _pad(duration.minutes());
                $scope.addsecs = _pad(duration.seconds());
            }

             addWaitTime();
             
            $interval(function () {
                duration.subtract(1, 'seconds');
                addWaitTime();
            }, 1000, seconds);
        }

        // Поведение нажатия на кнопку ГОТОВ
        function userReady(){

            $scope.iAmReady = true; //Меняем внешний вид кнопки

            var currentUrl = '/api/' + config.template + '/match/confirm';
            var data = {
                room_id: localStorage.getItem('roomId')
            };

            $http.post(currentUrl, data).then(function(response){
                timerButtonShow(600000);
                Analytics.trackEvent('match', 'confirm', '', {
                    type: localStorage.getItem('gameType'),
                    bet: localStorage.getItem('currentbit'),
                    betType: localStorage.getItem('currencyType'),
                    tourId: localStorage.getItem('currenttourId'),
                    server: localStorage.getItem('currenttourRegion')
                });
            });
        }

        // Запуск таймера до показа кнопки "Завершение матча"
        function timerButtonShow(time) {
            setTimeout(function(){
                $scope.showButtonEndMatch = true;
                console.log('началось');
            },time);
        }
        // Поведение нажатия на кнопку ГОТОВ
        /**
         *
         * @param win - 0 : проиграл, 1 : выиграл
         */
        function matchFinish(win){
            $scope.userChoosed = true; //Меняем внешний вид кнопки

            var currentUrl = '/api/' + config.template + '/match/result/manual';
            var data = {
                room_id: localStorage.getItem('roomId'),
                result: win
            };

            $http.post(currentUrl, data);
        }

        function sendMsg(){
            console.log('msgText: ', $scope.msgText);
            var data = {
                message_type: 'CHAT',
                msg: $scope.msg,
                room_id: $scope.room_id
            };
            socketService.sendMessage(data);
        }
        
        function openIssueModal(playerId, userName) {
            var modalData = {
                playerId: playerId,
                userName: userName
            };
            
            modalService.openModal('issue.html', { size: 'md', controller: 'IssueModalController' }, modalData);
        }

        function onCopyGameLinkClick() {
            Analytics.trackEvent('match', 'code', 'copied', {
                type: localStorage.getItem('gameType'),
                bet: localStorage.getItem('currentbit'),
                betType: localStorage.getItem('currencyType')
            });

            $scope.showcopyarea = true
        }

        /**
         * @param value
         * @return {string}
         * @private
         */
        function _pad(value) {
            return value > 9 ? '' + value : '0' + value;
        }
    }

})();

