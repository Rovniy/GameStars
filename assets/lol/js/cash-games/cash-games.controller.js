(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('CashGamesController', CashGamesController);

    CashGamesController.$inject = ['$scope', '$interval', '$timeout',
        'Analytics', 'config', 'notificationService', 'socketService', 'modalService', 'findGameService',
        'userProfileService', 'tournamentsService', 'matchService'];

    /* @ngInject */
    /**
     *
     * @param $scope
     * @param {angular.IIntervalService} $interval
     * @param {angular.ITimeoutService} $timeout
     * @param {Analytics} Analytics
     * @param {config} config
     * @param {notificationService} notificationService
     * @param {socketService} socketService
     * @param {modalService} modalService
     * @param {findGameService} findGameService
     * @param {userProfileService} userProfileService
     * @param {tournamentsService} tournamentsService
     * @param {matchService} matchService
     * @constructor
     */
    function CashGamesController($scope, $interval, $timeout,
                                 Analytics, config, notificationService, socketService, modalService, findGameService,
                                 userProfileService, tournamentsService, matchService) {
        var vm = this;
        var gameRegions = {};

        //Настройки выборки серверов
        vm.models = {
            'currentRegion': 0,
            'modelType': {
                "teamCount": "5",
                "betType": [
                    // {"type": "STAR_POINTS", "bet": [100, 500, 1000]},
                    {"type": "REAL_POINTS", "bet": [1, 5, 10]}
                ],
                "queue": ['solo', 'premade', 'team']
            },
            'modelBetType': {"type": "REAL_POINTS", "bet": [1, 5, 10]},
            'modelBet': 5,
            'modelQueue': 'solo'
        };
        //Настройки возможных параметров игры
        vm.cashConfig = [
            {
                'teamCount': '5', //Размер команды 5x5
                'betType': [
                    {
                        'type': 'STAR_POINTS',
                        'bet': [100, 500, 1000]
                    },
                    {
                        'type': 'REAL_POINTS',
                        'bet': [1, 5, 10]
                    }
                ],
                'queue': ['solo', 'premade', 'team']
            },
            {
                'teamCount': '1', //Размер команды 1х1
                'betType': [
                    {
                        'type': 'STAR_POINTS',
                        'bet': [100, 500, 1000]
                    },
                    {
                        'type': 'REAL_POINTS',
                        'bet': [1, 5, 10]
                    }
                ],
                'queue': ['solo']
            }
        ];
        vm.countPlayers = {};
        vm.loading = false;

        vm.applyCashGame = applyCashGame;
        vm.destroyCashGame = destroyCashGame;
        vm.isLoggedIn = isLoggedIn;
        vm.onApplyClick = onApplyClick;
        vm.isActiveRegion = isActiveRegion;
        vm.openPaymentModal = openPaymentModal;
        vm.showCancelButton = showCancelButton;
        vm.isPlayBtnActive = isPlayBtnActive;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('match', 'cashgame', '', {});

            $scope.$on('APPLICATION_TIMEOUT', checkCountSocket);
            $scope.$on('APPLICATION_APPLIED', onApplicationApplied);

            tournamentsService
                .getGames()
                .then(function (regions) {
                    for (var i = 0; i < regions.length; i++) {
                        gameRegions[regions[i].regionId] = regions[i].id;
                    }

                    vm.models.currentRegion = parseInt(localStorage.getItem('currenttourRegion')) || regions[0].id;
                })
                .then(function () {
                    // Получение дданых о очереди 1 раз в 5 секунд
                    var countQueue = checkCountSocket() && $interval(checkCountSocket, 5000);

                    // Остановка тика запросов по очереди
                    $scope.$on('$destroy', function () {
                        $interval.cancel(countQueue);
                    });
                });

            // Запрос истории чата
            $timeout(function () {
                var sendSocketChatHistory = {
                    "room_id": 'group_general',
                    "count": 25,
                    'message_type': 'CHAT_LOAD_HISTORY'
                };
                socketService.sendMessage(sendSocketChatHistory);
            }, 500);
        }

        function onApplicationApplied() {
            vm.loading = false;
        }

        /**
         * Кнопка «Играть»
         * @param {boolean} [force]
         */
        function applyCashGame(force) {
            // Попытка открытия сокета
            socketService.webSocketInit();

            if (!userProfileService.isVipStatus()) {
                force = true; //TODO
            }

            if (!userProfileService.getUserProfile()) {
                // если пользователь не залогинен, открываем окно регистрации и в случае успешной регистрации встаем в очередь
                var modalData = {regionId: getRegionById(vm.models.currentRegion)};
                var options = {controller: 'SignupModalController', backdrop: 'static'};
                var modalInstance = modalService.openModal('signup-verify-lol.html', options, modalData);
                modalInstance.result.then(function () {
                    // пользователь успешно зарегался, привязал аккаунт и залогинился
                    Analytics.trackEvent('match', 'start', 'signup', {
                        type: 'cashgame',
                        bet: vm.models.modelBet,
                        betType: vm.models.modelBetType.type,
                        server: vm.models.currentRegion
                    });

                    applyCashGame();
                });
            }
            else {
                localStorage.removeItem('currenttourId');
                
                localStorage.setItem('currencyType', vm.models.modelBetType.type);
                localStorage.setItem('gameType', 'cashgame');
                localStorage.setItem('currenttourId', '');
                localStorage.setItem('cashGamesParty', vm.models.modelQueue);
                localStorage.setItem('cashGamesTeamSize', vm.models.modelType.teamCount);
                localStorage.setItem('currenttourRegion', vm.models.currentRegion);
                localStorage.setItem('currentbit', vm.models.modelBetType.type == 'REAL_POINTS' ? vm.models.modelBet * 100 : vm.models.modelBet);

                var data = {
                    bid: (vm.models.modelBetType.type == 'REAL_POINTS' ? vm.models.modelBet * 100 : vm.models.modelBet),
                    currencyType: vm.models.modelBetType.type,
                    gameRegionId: vm.models.currentRegion,
                    teamSize: vm.models.modelType.teamCount,
                    patry: vm.models.modelQueue,
                    force: !!force
                };

                vm.loading = getRegionById(vm.models.currentRegion);

                matchService
                    .applyMatch(config.template, data)
                    .then(function () {
                        Analytics.trackEvent('match', 'start', '', {
                            type: 'cashgame',
                            bet: vm.models.modelBet,
                            betType: vm.models.modelBetType.type,
                            server: vm.models.currentRegion
                        });

                        checkCountSocket();
                    })
                    .catch(function (response) {
                        Analytics.trackEvent('match', 'failed', '', {
                            type: 'cashgame',
                            bet: vm.models.modelBet,
                            betType: vm.models.modelBetType.type,
                            server: vm.models.currentRegion,
                            reason: response.data.error.type
                        });

                        vm.loading = false;

                        switch (response.data.error.type) {
                            case 'NotPlayingTimeException':
                                notificationService.info('TOURNAMENT_NOTIFICATION__TIME_IS_OVER');
                                break;

                            case 'AccountBlockException':
                                notificationService.error('TOURNAMENT_NOTIFICATION__ACCOUNT_BLOCKED');
                                break;

                            case 'HaveViolationException':
                                var modalData = response.data.error.message;
                                modalService.openModal('youHaveBanned.html', {
                                    size: 'md',
                                    controller: 'BanSystemController'
                                }, modalData);
                                break;

                            case 'NotEnoughCostsException':
                                modalService.openBalanceErrorModal('cashegame.html', response.data.error.message);
                                break;

                            case 'NotEnoughCostCanUseBonusException':
                                var modal = modalService.openBalanceErrorModal('cashegame-bonus.html', response.data.error.message);
                                modal.result.then(function () {
                                    applyCashGame(true)
                                });
                                break;

                            case 'TournamentNotStartedException':
                                notificationService.info('TOURNAMENT_NOTIFICATION__TOURNAMENT_NOT_STARTED');
                                break;

                            case 'NotFoundGameAccountException':
                                var regionId = getRegionById(vm.models.currentRegion);
                                openConnectAccountModal(regionId);
                                notificationService.error('TOURNAMENT_NOTIFICATION__NOT_FOUND_ACCOUNT');
                                break;

                            case 'UserDesktopNotStartedException':
                                notificationService.error('TOURNAMENT_NOTIFICATION__NOT_FOUND_STARCLIENT');
                                break;

                            case 'GameRestrictionException':
                                if (response.data.error.message.type === 'LEVEL') {
                                    modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_LEVEL');
                                }
                                if (response.data.error.message.type === 'RATING') {
                                    modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_RATING');
                                }
                                if (response.data.error.message.type === 'BANNED') {
                                    modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_BANNED');
                                }
                                if (response.data.error.message.type === 'INACTIVE') {
                                    modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_INACTIVE');
                                }
                                break;

                            default:
                                notificationService.error('TOURNAMENT_NOTIFICATION__ERROR');
                                break;
                        }
                    });
            }
        }

        /**
         * Подключение нового аккаунта, если нет привязанного
         * @param {string} regionId
         */
        function openConnectAccountModal(regionId) {
            var instance = modalService.openModal('connect-account.html', {controller: 'AddAccountModalController'}, {regionId: regionId});
            instance.result.then(userProfileService.reloadUserProfile);
        }

        // Кнопка "ОТМЕНА"
        function destroyCashGame() {
            findGameService
                .applicationDisapply()
                .then(checkCountSocket);
        }

        function checkCountSocket() {
            return matchService
                .getQueueCount(vm.models.modelBetType.type)
                .then(function (data) {
                    vm.countPlayers = {};

                    // еб**ый формат
                    for (var prop in data) {
                        if (!data.hasOwnProperty(prop)) continue;

                        for (var regionId in gameRegions) {
                            var id = 'id=' + gameRegions[regionId];

                            if (prop.indexOf(id) !== -1){
                                vm.countPlayers[regionId] = data[prop]['0'];
                            }
                        }
                    }
                });
        }

        function isLoggedIn() {
            return !!userProfileService.getUserProfile();
        }

        // Трек-евент на события по клику на кнопку
        /**
         * Клик по кнопке "играть"
         * @param {string} regionId - EUW | EUNE | RU | NA
         */
        function onApplyClick(regionId) {
            vm.models.currentRegion = gameRegions[regionId];

            Analytics.trackEvent('click', 'match', 'start', {
                type: 'cashgame',
                bet: vm.models.modelBet,
                betType: vm.models.modelBetType.type,
                server: vm.models.currentRegion
            });

            if (localStorage.getItem('checkboxRememberAcceptBet')) {
                applyCashGame();
            } else {
                var modalInstance = modalService.openModal('ConfirmMyBetOrBan.html', {controller: 'ConfirmMyBetOrBan'});
                modalInstance.result.then(applyCashGame);
            }
        }

        function isActiveRegion(regionId) {
            return vm.models.currentRegion === gameRegions[regionId];
        }

        function openPaymentModal() {
            modalService.openModal('payment.html');
        }


        /**
         * Отображать ли кнопку "Отменить поиск"
         * @return {boolean}
         */
        function showCancelButton() {
            return findGameService.isTimerVisible() && localStorage.getItem('gameType') === 'cashgame';
        }

        /**
         * Активна ли кнопка "Играть"
         * @return {boolean}
         */
        function isPlayBtnActive() {
            return !findGameService.isTimerVisible();
        }

        /**
         * Получение regionId по id
         * @param {number} id
         * @returns {string}
         */
        function getRegionById(id) {
            for (var prop in gameRegions) {
                if (gameRegions[prop] === id){
                    return prop;
                }
            }
        }
    }

})();