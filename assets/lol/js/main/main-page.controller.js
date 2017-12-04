(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('MainPageController', MainPageController);

    MainPageController.$inject = ['$location', '$interval', '$timeout', '$http', '$scope', '$rootScope', 'config', 'modalService', 'userProfileService', 'userProfile'];

    /* @ngInject */
    /**
     * @param {angular.ILocationService} $location
     * @param {angular.IIntervalService} $interval
     * @param {angular.ITimeoutService} $timeout
     * @param {angular.IHttpService} $http
     * @param {angular.IScope} $scope
     * @param {angular.IRootScopeService} $rootScope
     * @param {config} config
     * @param {modalService} modalService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function MainPageController($location, $interval, $timeout, $http, $scope, $rootScope, config, modalService, userProfileService, userProfile) {
        var vm = this;
        var clockIntervalPromise;
        var liveActiveTimeoutPromise;
        var setNewActiveTimeoutPromise;
        var destroyed = false;

        vm.config = config;
        vm.slideIndex = 0;
        vm.statistics = {};
        vm.badCode = false;
        vm.timerEnded = false;
        vm.chartIndex = 1;
        vm.randomTime = 3000;
        vm.activityData = [];
        vm.activity = [];

        vm.openSignupModal = openSignupModal;
        vm.getUserProfile = getUserProfile;
        vm.getStatistic = getStatistic;
        vm.checkPromoCode = checkPromoCode;
        vm.liveActive = liveActive;
        vm.getServersInfo = getServersInfo;
        vm.autoJoinInTournament = autoJoinInTournament;

        activate();

        ////////////////

        function activate() {

            if (userProfile) {
                $location.url('/tournaments');
            }

            // Получение статистики по юзерам
            vm.getStatistic();

            // Получение списка октивностей
            vm.liveActive();

            // Получение списка серверов
            vm.getServersInfo('last_call','daily','weekly','vip','usa');

            // Таймер обратного отсчета
            initTimer();

            // Слайдер в block-2
            $("#slider-container").sliderUi({
                speed: 100,
                cssEasing: "cubic-bezier(0.285, 1.015, 0.165, 1.000)"
            });
            $("#caption-slide").sliderUi({
                caption: true
            });

            $scope.$on('$destroy', onDestroy);
        }

        function onDestroy() {
            destroyed = true;

            if (clockIntervalPromise) {
                $interval.cancel(clockIntervalPromise);
            }

            if (liveActiveTimeoutPromise) {
                $timeout.cancel(liveActiveTimeoutPromise);
            }

            if (setNewActiveTimeoutPromise) {
                $timeout.cancel(setNewActiveTimeoutPromise);
            }
        }

        function initTimer() {
            var newTime = localStorage.getItem('indexTimer');
            var clock = $('.clock').FlipClock({
                clockFace: 'HourlyCounter',
                autoStart: false,
                countdown: true
            });

            clock.setTime(newTime || 600);
            clockIntervalPromise = $interval(function(){
                var curtime = clock.getTime().time;
                if (curtime == 0) {
                    vm.timerEnded = true;
                    $interval.cancel(clockIntervalPromise);
                } else {
                    localStorage.setItem('indexTimer', curtime);
                }
            },1000);

            clock.start();
        }

        function number_format( str ){
            return str.replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
        }

        // Пполучение статистики по пользователям
        function getStatistic() {
            $http.get('/api/statistics/online-users').then(function (response) {
                var winners = String(response.data.winners);
                vm.statistics.winners = number_format(winners);
                var online = String(response.data.online);
                vm.statistics.online = number_format(online);
            });
            $http.get('/api/statistics/active-tournament-pool').then(function (response) {
                var pool = String(response.data.pool / 100);
                vm.statistics.pool = number_format(pool);
            });
        }

        // Проверка и регистрация по промокоду
        function checkPromoCode(data) {
            var options = {
                "code":data
            };
            $http.post('/api/reaction/promo/check', options).then(function successCallback(response) {
                localStorage.setItem('promocode', data);
                modalService.openModal('signup.html', { controller: 'SignupModalController', backdrop: 'static' });
            }, function errorCallback(response) {
                vm.badCode = true;
            });
        }

        // Запрос активности
        function liveActive() {
            var identy = 0;
            var maxLength;

            $http
                .get('/api/statistics/user-activity')
                .then(function (response) {
                    if (destroyed) {
                        return;
                    }

                    vm.activityData = response.data.data;
                    if (vm.activityData) maxLength = vm.activityData.length;

                    // Делаем стартовый массив
                    setStartArray();

                    // Собираем новый массив из цепочек событий
                    setNewActive();

                    // Делаем стартовый массив
                    function setStartArray() {
                        if (maxLength > 4) {
                            vm.activity[0] = vm.activityData[3];
                            vm.activity[1] = vm.activityData[2];
                            vm.activity[2] = vm.activityData[1];
                            vm.activity[3] = vm.activityData[0];
                        }
                    }

                    // Собираем новый массив из цепочек событий
                    function setNewActive() {
                        if (maxLength > 4) {
                            setNewActiveTimeoutPromise = $timeout(function(){
                                vm.randomTime = (Math.random() * (3 - 1) + 1)*1000;
                                vm.activity[3] = vm.activityData[identy+1];
                                vm.activity[2] = vm.activityData[identy+2];
                                vm.activity[1] = vm.activityData[identy+3];
                                vm.activity[0] = vm.activityData[identy+4];
                                maxLength--;
                                identy++;
                                setNewActive();
                            }, vm.randomTime);
                        }
                    }

                    liveActiveTimeoutPromise = $timeout(vm.liveActive, 90000);
                });
        }

        // получение списка серверов
        function getServersInfo(item1, item2, item3, item4, item5) {
            var serversInfoUrl = '/api/tournament/boarding-scoreboard?tags[]=' + item1 + '&tags[]=' + item2 + '&tags[]=' + item3 + '&tags[]=' + item4 + '&tags[]=' + item5;
            $http.get(serversInfoUrl).then(function (response) {
                vm.serversInfo = response.data.data;
            });
        }

        function autoJoinInTournament(tournament) {
            $rootScope.redirectToTour = tournament.id;
            var options = { controller: 'SignupModalController', backdrop: 'static' };
            var data = {regionId: tournament.gameRegion.regionId};
            modalService.openModal('signup-verify-lol.html', options, data);
        }

        function getUserProfile(){
            return userProfileService.getUserProfile();
        }

        function openSignupModal() {
            modalService.openModal('signup.html', { controller: 'SignupModalController', backdrop: 'static' });
        }
    }
})();