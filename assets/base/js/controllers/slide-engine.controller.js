(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('SlideEngineController', SlideEngineController);

    SlideEngineController.$inject = ['$scope', '$timeout', '$http', '$location', '$window', 'userProfileService', 'Analytics'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {angular.ITimeoutService} $timeout
     * @param {angular.IHttpService} $http
     * @param {angular.ILocationService} $location
     * @param {angular.IWindowService} $window
     * @param {userProfileService} userProfileService
     * @param {Analytics} Analytics
     * @constructor
     */
    function SlideEngineController($scope, $timeout, $http, $location, $window, userProfileService, Analytics) {
        var vm = this;
        /** @type Slide[] */
        var script;
        var duration;
        var currentUserName;
        var currentConfigName;
        var currentSlide;

        vm.visible = false;
        vm.listText = undefined;
        vm.hero1 = undefined;
        vm.send1 = undefined;
        vm.hero2 = undefined;
        vm.send2 = undefined;

        vm.nextSlide = nextSlide;
        vm.closeSession = closeSession;
        vm.goSomePage = goSomePage;

        activate();

        //////////////////////

        function activate() {

            // Вызов следующим способом: $rootScope.$broadcast('play-first-session');
            $scope.$on('play-first-session', function(){
                if (localStorage.getItem('firstSession')) {
                    console.log('firstSession: Первая сессия уже окончена');
                    vm.visible = false;
                    return;
                }

                console.log('firstSession: Получил евент и начал показывать мультик');
                vm.visible = true;

                getSlideConfig('firstsession.json')
                    .then(getUserName)
                    .then(startSlide);
            });

            $scope.$on('play-tournament-session', function(){
                if (localStorage.getItem('firstTournamentsSession')) {
                    console.log('firstSession: Сессия мультика в турнирах уже окончена');
                    vm.visible = false;
                    return;
                }

                console.log('firstSession: Получил евент и начал показывать мультик');
                vm.visible = true;

                getSlideConfig('tournamentSession.json')
                    .then(getUserName)
                    .then(startSlide);
            });

            $scope.$on('MATCH_FIRST_FOR_USER', function(e, data){
                console.log('получил экшн', data);
                if (data.win == true || data.win == false) {
                    if (data.win == true) {
                        if (localStorage.getItem('firstWinSession')) {
                            console.log('firstSession: Сессия первой победы');
                            vm.visible = false;
                            return;
                        }

                        console.log('firstSession: Получил евент и начал показывать мультик');
                        vm.visible = true;

                        getSlideConfig('firstWinSession.json')
                            .then(getUserName)
                            .then(startSlide);
                    } else if (data.win == false) {
                        if (localStorage.getItem('firstLoseSession')) {
                            console.log('firstSession: Сессия первого поражения');
                            vm.visible = false;
                            return;
                        }

                        console.log('firstSession: Получил евент и начал показывать мультик');
                        vm.visible = true;

                        getSlideConfig('firstLoseSession.json')
                            .then(getUserName)
                            .then(startSlide);
                    }
                }
            });
        }

        /**
         * @param {string} fileName
         * @returns {angular.IPromise<void>}
         */
        function getSlideConfig(fileName) {
            currentConfigName = fileName;

            return $http
                .get('/src/js/testData/' + fileName)
                .then(function(response) {
                    vm.visible = true;
                    script = response.data.data;
                });
        }

        /**
         * Вызов первого слайда
         */
        function startSlide() {
            nextSlide(0);
        }

        function animationSlide(i, slide) {
            if (script[slide][i].hero1Active) {
                vm.hero1 = {
                    "active": script[slide][i].hero1Active,
                    "dis": script[slide][i].hero1Dis
                };
            }
            if (script[slide][i].send1Text) {
                vm.send1 = {
                    "active": script[slide][i].send1Active,
                    "dis": script[slide][i].send1Dis,
                    "text": script[slide][i].send1Text.replace('%username%', currentUserName)
                };
            }
            if (script[slide][i].hero2Active) {
                vm.hero2 = {
                    "active": script[slide][i].hero2Active,
                    "dis": script[slide][i].hero2Dis
                };
            }
            if (script[slide][i].send2Text) {
                vm.send2 = {
                    "active": script[slide][i].send2Active,
                    "dis": script[slide][i].send2Dis,
                    "text": script[slide][i].send2Text.replace('%username%', currentUserName)
                };
            }
            if (script[slide][i].textArray) {
                vm.listText = script[slide][i];
            }

            duration = script[slide][i].duration*1000;
        }

        function nextSlide(slide) {
            vm.hero1 = undefined;
            vm.send1 = undefined;
            vm.hero2 = undefined;
            vm.send2 = undefined;
            vm.listText = undefined;

            next(0, slide);
        }

        function next(i, slide) {
            if (!vm.visible){
                return;
            }

            if (currentConfigName === 'firstsession.json') {
                currentSlide = i + 1;
                Analytics.trackEvent('firstsession', 'slide_' + currentSlide, '', {});
            }

            animationSlide(i++,slide);

            if (script[slide][i]){
                $timeout(function () {
                    next(i, slide);
                }, duration);
            }
        }

        // Закрытие окна по событию
        function closeSession() {
            if (currentConfigName === 'firstsession.json') {
                localStorage.setItem('firstSession', true);
                Analytics.trackEvent('firstsession', 'close', '', { index: currentSlide });
            }

            if (currentConfigName === 'tournamentSession.json') {
                localStorage.setItem('firstTournamentsSession', true);
            }

            if (currentConfigName === 'firstWinSession.json') {
                localStorage.setItem('firstWinSession', true);
            }

            if (currentConfigName === 'firstLoseSession.json') {
                localStorage.setItem('firstLoseSession', true);
            }

            vm.visible = false;
        }

        /**
         * Переход по ссылкам
         * @param {string} url
         */
        function goSomePage(url) {
            if (url.indexOf('http') !== -1){
                $window.open(url);
            }
            else {
                $location.url(url);
            }

            closeSession();
        }

        /**
         * @returns {angular.IPromise<void>}
         */
        function getUserName() {
            return userProfileService
                .loadUserProfile()
                .then(function (userProfile) {
                    currentUserName = userProfile.userData.name;
                });
        }
    }
})();

/**
 * @typedef {object} Slide
 * @property {number} duration
 * @property {boolean} [hero1Active]
 * @property {boolean} [hero1Dis]
 * @property {string} [send1Text]
 * @property {boolean} [send1Active]
 * @property {boolean} [send1Dis]
 * @property {boolean} [hero2Active]
 * @property {boolean} [hero2Dis]
 * @property {string} [send2Text]
 * @property {boolean} [send2Active]
 * @property {boolean} [send2Dis]
 * @property {SlideText[]} [textArray]
 */
/**
 * @typedef {object} SlideText
 * @property {number} id
 * @property {string} text
 * @property {string} action
 */