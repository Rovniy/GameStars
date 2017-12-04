(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('TournamentDetailsController', TournamentDetailsController);

    TournamentDetailsController.$inject = [
        '$scope', '$interval', '$timeout', '$rootScope', '$routeParams', '$filter', '$route',
        'Analytics', 'config', 'localizationService', 'notificationService', 'socketService',
        'modalService', 'userProfileService', 'findGameService', 'tournamentsService', 'referalService', 'matchService'];

    /* @ngInject */
    /**
     * Контроллер Турниров
     * @param {angular.IScope} $scope
     * @param {angular.IIntervalService} $interval
     * @param {angular.ITimeoutService} $timeout
     * @param $rootScope
     * @param {{id: number}} $routeParams
     * @param {angular.IFilterService} $filter
     * @param {angular.route.IRouteService} $route
     * @param {Analytics} Analytics
     * @param {config} config
     * @param {localizationService} localizationService
     * @param {notificationService} notificationService
     * @param {socketService} socketService
     * @param {modalService} modalService
     * @param {userProfileService} userProfileService
     * @param {findGameService} findGameService
     * @param {tournamentsService} tournamentsService
     * @param {referalService} referalService
     * @param {matchService} matchService
     * @constructor
     */
    function TournamentDetailsController($scope, $interval, $timeout, $rootScope, $routeParams, $filter, $route,
                                         Analytics, config, localizationService, notificationService, socketService,
                                         modalService, userProfileService, findGameService, tournamentsService, referalService, matchService) {
        var vm = this;

        /** @type {UserRebuyStatus} */
        vm.addonTourChips = undefined;
        /** @type {UserRebuyStatus} */
        vm.rebuyTourChips = undefined;
        vm.price = undefined;
        /** @type {UserTournamentStatus} */
        vm.tournCurrentUser = undefined;
        vm.tournListUsers = undefined;
        vm.tournRegDateStart = undefined;
        vm.defaultBuyIn = undefined;
        vm.tourImage = undefined;
        vm.startcountdown = undefined;
        vm.blindcountdown = undefined;
        vm.regcountdown = undefined;
        /** @type {Tournament} */
        vm.tournResult = undefined;
        vm.vipStatus = false;
        vm.tournamentId = $routeParams.id;
        vm.chatID = 'tournament_' + vm.tournamentId;
        vm.tournListUsersLimit = 3;
        vm.loading = false;
        vm.addonStartCountdown = '';
        vm.addonEndCountdown = '';
        vm.tournDateStart = undefined;
        vm.hasReferrals = false;
        vm.queueCount = 0;
        /** @type {TournamentWar} */
        vm.tournamentWar = undefined;

        vm.onApplyClick = onApplyClick;
        vm.openInfoStackModal = openInfoStackModal;
        vm.openExchangeSpModal = openExchangeSpModal;
        vm.openExchangeSpModalNoNActive = openExchangeSpModalNoNActive;
        vm.getConditions = getConditions;
        vm.isTakePartBtnActive = isTakePartBtnActive;
        vm.onTakePartClick = onTakePartClick;
        vm.isPlayBtnActive = isPlayBtnActive;
        vm.onSliderUpdate = onSliderUpdate;
        vm.isRebuyActive = isRebuyActive;
        vm.isPercentAwardPlaces = isPercentAwardPlaces;
        vm.isJoinVisible = isJoinVisible;

        activate();

        ////////////////

        function activate() {

            Analytics.trackEvent('tournament', 'show', '', {});

            tournamentsService
                .getTournament(vm.tournamentId)
                .then(function (tournament) {
                    vm.tournResult = tournament;
                    vm.tournamentWar = tournament.tournamentWars && tournament.tournamentWars[0];
                    vm.tourImage = vm.tournResult.backgroundPictureId || 1;
                    // начало турнира
                    vm.tournDateStart = toDateTime(vm.tournResult.tournament_info.start_date);
                    vm.price = vm.tournResult.tournament_info.blind_min;

                    // var periodStart = moment(vm.tournResult.tournament_info.start_date * 1000);
                    // var periodEnd = moment(vm.tournResult.tournament_info.end_date * 1000);
                    // $scope.tournamentPeriodDate = periodStart.format('MMM DD') + ' - ' + periodEnd.format('MMM DD');
                    // $scope.tournamentPeriodTime = periodStart.format('HH:mm') + ' - ' + periodEnd.format('HH:mm [GMT]Z');

                    /******************** Данные для Google Analitycs ******************/
                    $rootScope.gaTournamentStart = vm.tournDateStart;
                    $rootScope.gaTournamentPrize = vm.tournResult.award_fund;
                    $rootScope.gaTournamentPrizeCurrency = vm.tournResult.award_type;

                    vm.tournRegDateStart = toDateTime(vm.tournResult.tournament_info.reg_start_date);
                    vm.defaultBuyIn = getDefaultBuyIn(vm.tournResult.tournament_info.buy_in);

                    initInterval();
                    initQueueInterval();

                    $timeout(function () {
                        // Swipers
                        var mySwiper1 = new Swiper('.b-conditions-tour_prize-fund_swiper .swiper-container', {
                            direction: 'vertical',
                            loop: false,
                            nextButton: '.b-conditions-tour_prize-fund_swiper .swiper-button-next',
                            prevButton: '.b-conditions-tour_prize-fund_swiper .swiper-button-prev',
                            slidesPerView: 3,
                            simulateTouch: false,
                            mousewheelControl: true,
                            observer: true
                        });
                        var mySwiper2 = new Swiper('.b-conditions-tour_structure_list .swiper-container', {
                            direction: 'vertical',
                            loop: false,
                            nextButton: '.b-conditions-tour_structure_list .swiper-button-next',
                            prevButton: '.b-conditions-tour_structure_list .swiper-button-prev',
                            slidesPerView: 4,
                            simulateTouch: false,
                            mousewheelControl: true,
                            observer: true
                        });

                        mySwiper1.slideTo && mySwiper1.slideTo(0, 0);
                        mySwiper2.slideTo && mySwiper2.slideTo(0, 0);
                    });
                });

            tournamentsService
                .getLadder(vm.tournamentId)
                .then(function (ladder) {
                    vm.tournListUsers = ladder;
                });

            tournamentsService
                .getUserStatus(vm.tournamentId)
                .then(function (status) {
                    vm.tournCurrentUser = status;
                    vm.rebuyTourChips = status.rebuy;
                    vm.addonTourChips = status.addon;
                    if (status.buyInUserStatus === 'VIP') {
                        vm.vipStatus = true;
                    }

                    initAddonInterval();
                });

            referalService
                .getReferalLink()
                .then(function (data) {
                    vm.hasReferrals = data.referrers.length !== 0;
                });

            $timeout(function () {
                var sendSocketChatHistory = {
                    "room_id": 'tournament_' + vm.tournamentId,
                    "count": 25,
                    'message_type': 'CHAT_LOAD_HISTORY'
                };
                socketService.sendMessage(sendSocketChatHistory);
            }, 500);


            if ($rootScope.redirectToTour && $rootScope.redirectToTour !== '') {
                joinTournament();
                $rootScope.redirectToTour = '';
            }

        }

        /**
         * Изменилось положение слайдера
         * @param {number} value
         */
        function onSliderUpdate(value) {
            vm.price = value;
        }

        function initQueueInterval() {
            getQueueCount();

            var interval = $interval(getQueueCount, 5000);

            $scope.$on('$destroy', function () {
                $interval.cancel(interval);
            });
        }

        function getQueueCount() {
            matchService
                .getQueueCount('TOURNAMENT_POINTS', vm.tournamentId, vm.tournResult.game_region.id)
                .then(function (count) {
                    vm.queueCount = count;
                });
        }

        function initInterval() {
            vm.startcountdown = createTimerObject(vm.tournResult.start_countdown);
            vm.regcountdown = createTimerObject(vm.tournResult.reg_countdown);
            vm.blindcountdown = createTimerObject(vm.tournResult.blind_countdown);

            var countdownInterval = $interval(function () {
                updateStartCountdown();
                updateRegCountdown();
                updateBlindCountdown();
            }, 1000);

            $scope.$on('$destroy', function () {
                $interval.cancel(countdownInterval);
            });
        }

        function initAddonInterval() {
            if (!vm.addonTourChips) {
                return;
            }

            if (vm.addonTourChips.startCountDown === 0 && vm.addonTourChips.endCountdown === 0) {
                return;
            }

            vm.addonStartCountdown = formatStartAddonCountdown(vm.addonTourChips.startCountDown);
            vm.addonEndCountdown = formatEndAddonCountdown(vm.addonTourChips.endCountdown);
            vm.addonHoursRemaining = Math.round(vm.addonTourChips.fromMinutes/60/60);

            var countdownInterval = $interval(function () {
                updateAddonStartCountdown();
                updateAddonEndCountdown();
            }, 1000);

            $scope.$on('$destroy', function () {
                $interval.cancel(countdownInterval);
            });
        }

        function formatStartAddonCountdown(seconds) {
            var timer = createTimerObject(seconds);

            return timer.days + 'd ' + timer.hours + 'h ' + timer.minutes + 'm';
        }

        function formatEndAddonCountdown(seconds) {
            var timer = createTimerObject(seconds);

            return timer.hours + ':' + timer.minutes;
        }

        function updateAddonStartCountdown() {
            if (vm.addonTourChips.startCountDown === 0) {
                vm.addonStartCountdown = '';
                return;
            }

            vm.addonStartCountdown = formatStartAddonCountdown(vm.addonTourChips.startCountDown);

            if (--vm.addonTourChips.startCountDown === 0) {
                $route.reload();
            }
        }

        function updateAddonEndCountdown() {
            if (vm.addonTourChips.endCountdown === 0) {
                vm.addonEndCountdown = '';
                return;
            }

            vm.addonEndCountdown = formatEndAddonCountdown(vm.addonTourChips.endCountdown);

            if (--vm.addonTourChips.endCountdown === 0) {
                $route.reload();
            }
        }

        /**
         * @param {number} seconds
         * @return {{days: *, hours: *, minutes: *}}
         */
        function createTimerObject(seconds) {
            var duration = moment.duration(seconds, 'seconds');

            return {
                days: duration.days(),
                hours: _pad(duration.hours()),
                minutes: _pad(duration.minutes() + 1)
            };
        }

        // окончание регистрации
        function updateStartCountdown() {
            if (vm.tournResult.start_countdown === 0) {
                return;
            }

            vm.startcountdown = createTimerObject(vm.tournResult.start_countdown);

            if (--vm.tournResult.start_countdown === 0) {
                $route.reload();
            }
        }

        // Поздняя регистрация
        function updateRegCountdown() {
            if (vm.tournResult.reg_countdown === 0) {
                return;
            }

            vm.regcountdown = createTimerObject(vm.tournResult.reg_countdown);

            if (--vm.tournResult.reg_countdown === 0) {
                $route.reload();
            }
        }

        // До повышения минимальной ставки
        function updateBlindCountdown() {
            if (vm.tournResult.blind_countdown === 0) {
                return;
            }

            vm.blindcountdown = createTimerObject(vm.tournResult.blind_countdown);

            if (--vm.tournResult.blind_countdown === 0) {
                $route.reload();
            }
        }

        /**
         * Вступление в турнир
         * @param {string} [utm] - поле utm из tournamentWars
         */
        function joinTournament(utm) {
            // TODO: выбор типа валюты
            // var data = vm.tournResult.tournament_info.buy_in;
            // var options = { controller: 'JoinTournamentModalController' };
            // var modalInstance = modalService.openModal('tournament/join-tournament-modal.view.html', options, data);
            // modalInstance.result.then(_joinTournament);

            Analytics.trackEvent('tournament', 'participate', 'click', {
                tourId: vm.tournamentId,
                utm: utm
            });

            vm.loading = true;

            return tournamentsService
                .joinCheck(vm.tournamentId, vm.defaultBuyIn.currencyType, utm)
                .then(function () {
                    var amount = vm.tournResult.tournament_info.buy_in[0].value / 100;
                    var modalInstance = modalService.openModal('tournament/acceptJoinTournament.html', {}, {amount: amount});
                    modalInstance.result.then(function () {
                        _joinTournament(vm.defaultBuyIn, utm);
                    });
                })
                .catch(onJoinCheckError)
                .finally(function () {
                    vm.loading = false;
                });

            /**
             * @param {ServerError} error
             */
            function onJoinCheckError(error) {
                Analytics.trackEvent('tournament', 'rejection', '', {
                    reason: error.type,
                    tourId: vm.tournamentId,
                    utm: utm
                });

                switch (error.type) {
                    case 'NotFoundGameAccountException':
                        var options = {controller: 'AddAccountModalController'};
                        var data = {regionId: vm.tournResult.game_region.regionId};
                        modalService.openModal('connect-account.html', options, data);
                        break;

                    case 'UserWronglevelException':
                        modalService.openTextModal('ALERT__USER_WRONG_EXCEPTION');
                        break;

                    case 'NotEnoughCostsException':
                        modalService.openBalanceErrorModal('buyin.html', error.message);
                        break;

                    case 'NotEnoughCostCanUseBonusException':
                        var modal = modalService.openBalanceErrorModal('buyin-bonus.html', error.message);
                        modal.result.then(function () {
                            _joinTournament(vm.defaultBuyIn, utm, true);
                        });
                        break;

                    case 'UserAlreadyRegisteredException':
                        modalService.openTextModal('ALERT__USER_ALREADY_REGISTERED_EXCEPTION');
                        break;

                    case 'UserDesktopNotStartedException':
                        modalService.openTextModal('ALERT__USER_HAVE_NO_ACTUAL_DESCTOP');
                        break;

                    case 'GameRestrictionException':
                        if (error.message.type === 'LEVEL') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_LEVEL');
                        }
                        if (error.message.type === 'RATING') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_RATING');
                        }
                        if (error.message.type === 'BANNED') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_BANNED');
                        }
                        if (error.message.type === 'INACTIVE') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_INACTIVE');
                        }
                        break;

                    default:
                        break;
                }
            }
        }

        // Вход в турнир после выбора валюты buy in
        /**
         * Вступление в турнир после прохождения проверок
         * @param {TournamentBuyIn} buyIn
         * @param {string} [utm] - поле utm из tournamentWars
         * @param {boolean} [force=false]
         */
        function _joinTournament(buyIn, utm, force) {
            if (!userProfileService.isVipStatus()) {
                force = true; //TODO
            }

            vm.loading = true;

            return tournamentsService
                .join(vm.tournamentId, buyIn.currencyType, utm, force)
                .then(function () {
                    Analytics.trackEvent('tournament', 'participate', '', {
                        tourId: vm.tournamentId,
                        utm: utm,
                        prize: $filter('transaction')($rootScope.gaTournamentPrize, $rootScope.gaTournamentPrizeCurrency)
                    });

                    $route.reload();
                })
                .catch(onJoinError)
                .finally(function () {
                    vm.loading = false;
                });

            /**
             * @param {ServerError} error
             */
            function onJoinError(error) {
                Analytics.trackEvent('tournament', 'rejection', '', {
                    reason: error.type,
                    tourId: vm.tournamentId,
                    utm: utm
                });

                var data, options, modal;

                switch (error.type) {
                    case 'NotFoundGameAccountException':
                        options = {controller: 'AddAccountModalController'};
                        data = {regionId: vm.tournResult.game_region.regionId};
                        modalService.openModal('connect-account.html', options, data);
                        break;

                    case 'UserWronglevelException':
                        modalService.openTextModal('ALERT__USER_WRONG_EXCEPTION');
                        break;

                    case 'NotEnoughCostsException':
                        modalService.openBalanceErrorModal('buyin.html', error.message);
                        break;

                    case 'NotEnoughCostCanUseBonusException':
                        modal = modalService.openBalanceErrorModal('buyin-bonus.html', error.message);
                        modal.result.then(function () {
                            _joinTournament(buyIn, utm, true);
                        });
                        break;

                    case 'UserAlreadyRegisteredException':
                        modalService.openTextModal('ALERT__USER_ALREADY_REGISTERED_EXCEPTION');
                        break;

                    case 'UserDesktopNotStartedException':
                        modalService.openTextModal('ALERT__USER_HAVE_NO_ACTUAL_DESCTOP');
                        break;

                    case 'GameRestrictionException':
                        if (error.message.type === 'LEVEL') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_LEVEL');
                        }
                        if (error.message.type === 'RATING') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_RATING');
                        }
                        if (error.message.type === 'BANNED') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_BANNED');
                        }
                        if (error.message.type === 'INACTIVE') {
                            modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_INACTIVE');
                        }
                        break;

                    case 'TODO': //TODO: exception
                        data = {
                            // команда в которую пользователь хочет попасть
                            team1: vm.tournamentWar.commands[0].utm === utm ? vm.tournamentWar.commands[0] : vm.tournamentWar.commands[1],
                            // противоположная команда, соответственно
                            team2: vm.tournamentWar.commands[0].utm === utm ? vm.tournamentWar.commands[1] : vm.tournamentWar.commands[0]
                        };
                        modal = modalService.openModal('tournament/war-join-error-modal.view.html', {}, data);
                        modal.result.then(function (result) {
                            if (result === 'join') {
                                // пользователь выбрал вступить в другую команду
                                _joinTournament(buyIn, data.team2.utm, force);
                            }
                            else {
                                // пользователь нажал REMIND ME WHEN I CAN JOIN ARMY X
                                console.warn('NOT IMPLEMENTED');
                            }
                        });
                        break;

                    default:
                        break;
                }
            }
        }

        function apply() {
            Analytics.trackEvent('click', 'match', 'start', {
                type: 'tournament',
                bet: vm.price,
                betType: 'TOURNAMENT_POINTS',
                tourId: vm.tournamentId,
                server: vm.tournResult.game_region.id
            });

            socketService.webSocketInit();

            localStorage.setItem('dirtyStatus', false);
            if (vm.price == 0) return; //todo

            localStorage.setItem('gameType', 'tournament');
            localStorage.setItem('currentbit', vm.price);
            localStorage.setItem('currencyType', 'TOURNAMENT_POINTS');
            localStorage.setItem('currenttourId', vm.tournamentId);
            localStorage.setItem('currenttourRegion', vm.tournResult.game_region.id);

            var data = {
                bid: vm.price,
                tournamentId: vm.tournamentId,
                currencyType: 'TOURNAMENT_POINTS',
                gameRegionId: vm.tournResult.game_region.id
            };

            return tournamentsService
                .apply(config.template, data)
                .then(onApplySuccess)
                .catch(onApplyError);
        }

        function onApplySuccess() {
            Analytics.trackEvent('match', 'start', '', {
                type: 'tournament',
                bet: vm.price,
                betType: 'TOURNAMENT_POINTS',
                tourId: vm.tournamentId,
                server: vm.tournResult.game_region.id
            });

            getQueueCount();

            canShowInviteNotification() && openInviteNotificationModal();
        }

        /**
         * @param {ServerError} error
         */
        function onApplyError(error) {
            Analytics.trackEvent('match', 'failed', '', {
                type: 'tournament',
                bet: vm.price,
                betType: 'TOURNAMENT_POINTS',
                reason: error.type,
                tourId: vm.tournamentId,
                server: vm.tournResult.game_region.id
            });

            switch (error.type) {
                case 'NotPlayingTimeException':
                    notificationService.info('TOURNAMENT_NOTIFICATION__TIME_IS_OVER');
                    break;

                case 'AccountBlockException':
                    notificationService.info('TOURNAMENT_NOTIFICATION__ACCOUNT_BLOCKED');
                    break;

                case 'HaveViolationException':
                    modalService.openModal('youHaveBanned.html', {
                        size: 'md',
                        controller: 'BanSystemController'
                    }, error.message);
                    break;

                case 'TournamentNotStartedException':
                    notificationService.info('TOURNAMENT_NOTIFICATION__TOURNAMENT_NOT_STARTED');
                    break;

                case 'UserDesktopNotStartedException':
                    modalService.openTextModal('ALERT__USER_HAVE_NO_ACTUAL_DESCTOP');
                    break;

                case 'NotEnoughCostsException':
                    notificationService.info('ALERT__TOURNAMENT_APPLY_NOT_ENOUGH_COSTS');
                    break;

                case 'GameRestrictionException':
                    if (error.message.type === 'LEVEL') {
                        modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_LEVEL');
                    }
                    if (error.message.type === 'RATING') {
                        modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_RATING');
                    }
                    if (error.message.type === 'BANNED') {
                        modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_BANNED');
                    }
                    if (error.message.type === 'INACTIVE') {
                        modalService.openTextModal('ALERT__TOURNAMENT_RESTRICTION_INACTIVE');
                    }
                    break;

                default:
                    notificationService.info('TOURNAMENT_NOTIFICATION__ERROR');
                    break;
            }
        }

        function openSignupModal() {
            modalService.openModal('signup.html', {controller: 'SignupModalController', backdrop: 'static'});
        }

        function openInfoStackModal() {
            modalService.openModal('tournament/info-stack.html');
        }

        function openExchangeSpModal() {
            var options = {controller: 'RebuyTournamentChipsController'};
            var data;
            if (vm.addonTourChips && vm.addonTourChips.available) {
                data = {
                    rebuy: vm.addonTourChips, // addon или rebuy в зависимости от их available
                    tournamentId: vm.tournamentId
                };
            } else if (vm.rebuyTourChips && vm.rebuyTourChips.available) {
                data = {
                    rebuy: vm.rebuyTourChips, // addon или rebuy в зависимости от их available
                    tournamentId: vm.tournamentId
                };
            }
            var modalInstance = modalService.openModal('tournament/exchange-sp.html', options, data);
            return modalInstance.result.then(function () {
                $route.reload();
                userProfileService.reloadUserProfile();
            })
        }

        function openExchangeSpModalNoNActive() {
            modalService.openModal('addon-non-active-desc.html');
        }

        // Конвертация из секунд в дату
        function toDateTime(seconds) {
            return moment(seconds * 1000).format('DD.MM HH:mm [GMT]Z');
        }

        function getConditions() {
            if (!!vm.tournResult && !!vm.tournResult.conditions){
                return vm.tournResult.conditions[localizationService.getLanguage().toLowerCase()] || vm.tournResult.conditions['en'];
            }
        }

        /**
         * Получение default buyin по флагу isDefault
         * @param {TournamentBuyIn[]} buyInList
         * @return {TournamentBuyIn}
         */
        function getDefaultBuyIn(buyInList) {
            for (var i = 0; i < buyInList.length; i++) {
                if (buyInList[i].isDefault) {
                    return buyInList[i];
                }
            }
        }

        /**
         * Активна ли кнопка "Принять участие"
         * @return {boolean}
         */
        function isTakePartBtnActive() {
            return !!vm.tournResult &&
                (vm.tournResult.tournament_info.status === 'POST_REG' ||
                vm.tournResult.tournament_info.status === 'PRE_REG' ||
                vm.tournResult.tournament_info.class === 'SIT_AND_GO');
        }

        /**
         * Активна ли кнопка "Играть"
         * @return {boolean}
         */
        function isPlayBtnActive() {
            return !!vm.tournResult && !findGameService.isTimerVisible() &&
                (vm.tournResult.tournament_info.status === 'START' || vm.tournResult.tournament_info.status === 'POST_REG');
        }

        /**
         * Клик по кнопке "Принять участие"
         * @param {string} [utm] - поле utm из tournamentWars
         */
        function onTakePartClick(utm) {
            if (userProfileService.getUserProfile()) {
                joinTournament(utm);
            }
            else {
                openSignupModal();
            }
        }

        /**
         * true, если отображать призовые места с %
         * @return {boolean}
         */
        function isPercentAwardPlaces() {
            return !!vm.tournResult &&
                (vm.tournResult.tournament_info.award_computing === 'TOP_PERCENTAGE_BY_CHIPS' || vm.tournResult.tournament_info.award_computing === 'TOP_PERCENTAGE_BY_PLACE');
        }

        /**
         * Можно ли показать оповещение о ребае:
         * - сегодня еще не показывали
         * - ребай активен
         * - у пользователя меньше 1000 фишек
         * @return {boolean}
         */
        function canShowRebuyNotification() {
            var stack = vm.tournCurrentUser && vm.tournCurrentUser.stackCount < 1000;
            var timestamp = parseInt(localStorage.getItem('rebuyNotificationTimestamp') || 0);
            var alreadyShown = moment().isSame(moment(timestamp), 'day');

            return stack && !alreadyShown && isRebuyActive();
        }

        /**
         * Открыть конко с предложением сделать ребай
         * @return {angular.IPromise<void>}
         */
        function openRebuyNotificationModal() {
            localStorage.setItem('rebuyNotificationTimestamp', Date.now());
            var modalInstance = modalService.openModal('tournament/rebuy-notification-modal.view.html');
            return modalInstance.result.then(openExchangeSpModal);
        }

        /**
         * Активна ли кнопка rebuy
         * @return {boolean}
         */
        function isRebuyActive() {
            return (!!vm.rebuyTourChips && vm.rebuyTourChips.available) || (!!vm.addonTourChips && vm.addonTourChips.available);
        }

        /**
         * Клик по кнопке "Играть"
         */
        function onApplyClick() {
            if (canShowRebuyNotification()) {
                // пользователь не сделал ребай. Если сделал - $route.reload()
                return openRebuyNotificationModal().catch(apply);
            }

            if (localStorage.getItem('checkboxRememberAcceptBet')) {
                apply();
            } else {
                var modalInstance = modalService.openModal('ConfirmMyBetOrBan.html', {controller: 'ConfirmMyBetOrBan'});
                modalInstance.result.then(apply);
            }
        }

        /**
         * Можно ли показывать модалку "Пригласи друга":
         * - сегодня еще не показывали
         * - пользователь еще никого не приглашал
         * @return {boolean}
         */
        function canShowInviteNotification() {
            var timestamp = parseInt(localStorage.getItem('inviteNotificationTimestamp') || 0);
            var alreadyShown = moment().isSame(moment(timestamp), 'day');

            return !alreadyShown && !vm.hasReferrals;
        }

        /**
         * Открыть конко с предложением пригласить друга
         * @return {angular.IPromise<void>}
         */
        function openInviteNotificationModal() {
            localStorage.setItem('inviteNotificationTimestamp', Date.now());
            var modalInstance = modalService.openModal('tournament/invite-notification-modal.view.html');
            return modalInstance.result;
        }

        /**
         * Показывать ли кнопку вступления в турнир
         * @return {boolean}
         */
        function isJoinVisible() {
            return !!vm.tournResult && vm.tournResult.tournament_info.status !== 'FINISH' &&
                (!vm.tournCurrentUser || vm.tournCurrentUser.status === 'NONE' || vm.tournCurrentUser.status === 'JOIN' || vm.tournCurrentUser.status === 'OUT');
        }

        /**
         * @param {number} value
         * @return {string}
         */
        function _pad(value) {
            return value > 9 ? '' + value : '0' + value;
        }
    }

})();