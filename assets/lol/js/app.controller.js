(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('AppController', AppController);

    AppController.$inject = [
        '$scope', '$http', '$rootScope', '$location', '$timeout', '$cookies',
        'config', 'localizationService', 'userProfileService', 'notificationService', 'socketService',
        'modalService', 'tournamentsService', 'intercomService', 'findGameService', 'Analytics'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {angular.IHttpService} $http
     * @param $rootScope
     * @param {angular.ILocationService} $location
     * @param {angular.ITimeoutService} $timeout
     * @param {angular.cookies.ICookiesService} $cookies
     * @param {config} config
     * @param {localizationService} localizationService
     * @param {userProfileService} userProfileService
     * @param {notificationService} notificationService
     * @param {socketService} socketService
     * @param {modalService} modalService
     * @param {tournamentsService} tournamentsService
     * @param {intercomService} intercomService
     * @param {findGameService} findGameService
     * @param {Analytics} Analytics
     * @constructor
     */
    function AppController($scope, $http, $rootScope, $location, $timeout, $cookies,
                           config, localizationService, userProfileService, notificationService, socketService,
                           modalService, tournamentsService, intercomService, findGameService, Analytics) {
        var vm = this;


        vm.config = config;
        vm.hidePreloader = undefined;

        vm.getLanguage = getLanguage;
        vm.errorReport = errorReport;
        vm.isLoggedIn = isLoggedIn;
        vm.showEmailValidationMessage = showEmailValidationMessage;
        vm.showOldBrowserMessage = showOldBrowserMessage;
        vm.resendEmail = resendEmail;
        vm.getUserEmail = getUserEmail;

        //TODO: выпилить $rootScope.userProfile до конца
        Object.defineProperty($rootScope, 'userProfile', {
            get: function () {
                return userProfileService.getUserProfile();
            }
        });

        // Запрос истории чата на главной странице
        /*$timeout(function() {
         $scope.sendSocketChatHistory = {
         "room_id": 'group_general',
         "count": 50,
         'message_type': 'CHAT_LOAD_HISTORY'
         };
         socketService.sendMessage($scope.sendSocketChatHistory);
         }, 500);*/

        activate();
        
        ////////////////

        function activate() {
            // получение профиля, она же попытка логина.
            userProfileService
                .loadUserProfile()
                .then(_onLogin)
                .finally(function () {
                    vm.hidePreloader = true;
                });

            // Получение списка серверов
            tournamentsService
                .getGames()
                .then(function (regions) {
                    $rootScope.regionName = regions;
                });

            // ws: если собралась комната
            $scope.$on('APPLICATION_MATCHED', function (e, data) {
                document.getElementById('MusicReady').play();
                document.getElementById('MusicReady').volume = 0.6;
                localStorage.setItem('roomId', data.room_id);
                //Окно подтверждения игры
                $rootScope.room_id = data.room_id;
                
                openMatchAcceptModal();
                findGameService.hideTimer();
            });

            // WS: Если отменил поиск
            $scope.$on('APPLICATION_DISAPPLIED', function () {
                findGameService.hideTimer();
                notificationService.info('FIND_GAME_NOTIFICATION__YOU_CANCELED_SEARCH', true);
            });

            // WS: Если вышло время ожидания подбора, то скрываем окно
            $scope.$on('APPLICATION_TIMEOUT', function (e, data) {
                localStorage.setItem('dirtyStatus', false);
                notificationService.info('APP_NOTIFICATION__SEARCH_FAIL', true);

                openReacceptModal();

                findGameService.hideTimer();

            });

            $scope.$on('SYSTEM', function (e, data) {
                notificationService.info(data.message, true);
            });

            // WS: Если вышло время ожидания подбора, то скрываем модальное окно
            $scope.$on('APPLICATION_ROOM_TIMEOUT', function (e, data) {
                notificationService.info('APP_NOTIFICATION__CONFIRM_FAIL', true);
                openReacceptModal();
            });

            // WS: Если пришел BROKEN и из за тебя всех выкинуло
            $scope.$on('APPLICATION_BROKEN', function (e, data) {
                notificationService.info('APP_NOTIFICATION__YOUR_CONFIRM_FAIL', true);
                $rootScope.modalInstance && $rootScope.modalInstance.close();
            });

            // WS: Кто-то отменил свою ставку, наажав "Отмена"
            $scope.$on('APPLICATION_DECLINED', function () {
                notificationService.info('IM_READY_FOR_GAME_NOTIFICATION__ONE_MEMBER_DECLINED');

                // Воспроизведение звука при отмены матча
                document.getElementById('matchDestroyed').play();
                document.getElementById('matchDestroyed').volume = 0.2;

                openReacceptModal();
            });

            // WS: Если команды сформированны
            $scope.$on('MATCH_CREATED', function (e, data) {

                localStorage.setItem('roomId', data.match_id);
                findGameService.hideTimer();

                $rootScope.modalInstance && $rootScope.modalInstance.close();
                openMatchWindow('CREATED');
            });

            // WS: если пришел COMPLITE матча
            $scope.$on('MATCH_RESULTS_RECEIVED', function (e, data) {
                $rootScope.modalInstance && $rootScope.modalInstance.close();
                localStorage.setItem('roomId', data.match_id);
                openMatchWindow('COMPLITED');
            });

            // WS: если матч окончился
            $scope.$on('MATCH_FINISH', function (e, data) {
                $rootScope.modalInstance && $rootScope.modalInstance.close();
                localStorage.setItem('roomId', data.match_id);
                openMatchWindow('FINISHED');
            });

            // Если сервер прислал сигнал о окончании матча и расформировании комнаты
            $scope.$on('MATCH_DESTROYED', function(e, data){
                localStorage.setItem('roomId', data.match_id);

                $rootScope.modalInstance && $rootScope.modalInstance.close();
                openMatchWindow('DESTROYED', data.matchExtStatus);

                // Воспроизведение звука при отмены матча
                document.getElementById('matchDestroyed').play();
                document.getElementById('matchDestroyed').volume = 0.2;

                notificationService.error('MATCH_NOTIFICATION__ANOTHER_PLAYER_IS_OFFLINE');
            });

            $scope.$on('SOCKET_DISCONNECTED', function () {
                console.log('SOCKET_DISCONNECTED');
            });

            $scope.$on('SOCKET_CONNECTED_AGAIN', function () {
                console.log('SOCKET_CONNECTED_AGAIN');
            });

            // активация бафа
            $scope.$on('ITEM_APPLIED', function (e, data) {
                modalService.openBuffModal(data.item.name, { amount: data.count }, true);
            });
            $scope.$on('ITEM_CREATED', function (e, data) {
                modalService.openBuffModal(data.item.name, { amount: data.count }, false);
            });

            $scope.$on('CURRENCY_UPDATED', function (e, data) {
                userProfileService.currencyUpdated(data);
            });

            intercomService.on('authentication.logout', _onLogout);

            intercomService.on('authentication.login', _onLogin);

            $timeout(function () {
                $scope.errorReportShow = true;
            }, 5000);


            // Редирект после авторизации из соц. сетей
            var myFormerUrl = localStorage.getItem('myFormerUrl');
            if (myFormerUrl) {
                localStorage.removeItem('myFormerUrl');
                location.href = myFormerUrl;
            }

            var error = $location.search()['error'];
            if (error){
                $location.url($location.path());
                
                switch (error){
                    case 'EmailAlreadyInUseException':
                        modalService.openTextModal('SIGN_UP__EMAIL_ALREADY_USED');
                        break;
                    
                    default:
                        console.warn('Unknown error: ' + error);
                        break;
                }
            }
        }

        function getLanguage() {
            return localizationService.getLanguage();
        }

        /**
         * Функция открытия окна матча при перезагрузки
         * @param {string} status - статус матча
         * @param {string} [cancel_reason] - причина развала 
         */
        function openMatchWindow(status, cancel_reason) {
            var data = {
                status: status,
                cancel_reason: cancel_reason
            };
            var options = {
                controller: 'MatchStartController',
                absolutePath: true,
                size: 'match',
                backdrop: 'static',
                backdropClass: 'fadeMatchModalOpen'
            };
            $rootScope.modalInstance = modalService.openModal('match.html', options, data);
        }

        function collectData() {
            return {
                navigator: navigator,
                cookies: $cookies.getAll(),
                profile: userProfileService.getUserProfile(),
                localStorage: localStorage,
                sessionStorage: sessionStorage
            }
        }

        function errorReport() {
            $http
                .post('/api/report/socket', {
                    os: navigator.platform,
                    browser: navigator.userAgent,
                    data: collectData()
                })
                .then(function () {
                    console.log('errorReport success');
                    $scope.errorReportSended = true;
                });
        }

        /**
         * @return {boolean}
         */
        function isLoggedIn() {
            return !!userProfileService.getUserProfile();
        }
        
        function _onLogout() {
            userProfileService.resetUserProfile();
            $location.url('/');
            socketService
                .close()
                .then(function () {
                    // дожидаемся закрытия сокета
                    //TODO
                    location.reload();
                });
        }
        
        function _onLogin() {
            if ($location.url() == '/') {
                $location.url('/tournaments');
            }

            /*#elevio-base-menu {
                display: none;
            }*/
            /**
             * ЭТО ЕБАНЫЙ ЭЛЕВИО. НЕ ТРОГАЙТЕ ЕГО!
             * @type {Element}
             */
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.text = atob('dmFyIF9lbGV2ID0gd2luZG93Ll9lbGV2IHx8IHt9OyhmdW5jdGlvbigpIHt2YXIgaSxlO2k9ZG9jdW1lbn' +
                'QuY3JlYXRlRWxlbWVudCgic2NyaXB0IiksaS50eXBlPSd0ZXh0L2phdmFzY3JpcHQnO2kuYXN5bmM9MSxpLnNyYz0iaHR0cHM6' +
                'Ly9zdGF0aWMuZWxldi5pby9qcy92My5qcyIsZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgic2NyaXB0IilbMF0sZS' +
                '5wYXJlbnROb2RlLmluc2VydEJlZm9yZShpLGUpO30pKCk7X2VsZXYuYWNjb3VudF9pZD0nNTcwYmE2ZGY5MGJmNyc7');
            $("body").append( script );


            return userProfileService
                .loadUserProfile()
                .then(function (userProfile) {
                    socketService.webSocketInit();

                    // Идентификация в CarrotQuest // @TODO move to Analytics directive
                    //if (window.location.host == "lol.gamestars.gg") {
                    //    var hash = CryptoJS.HmacSHA256(userProfile.userData.id, 'userauthkey-2465-73084bff47f5c153e7327ab23ed81cbed2df12f561e3855f59a97833335fe6b').toString(); //Генерирования Hmac SHA256 ключа авторизации пользователя
                    //
                    //    carrotquest.auth(userProfile.userData.id, hash); //Посылаем ключ авторизации
                    //
                    //    carrotquest.identify({
                    //        '$name': userProfile.userData.name, //Имя
                    //        '$email': userProfile.userData.email, //почта
                    //        'Starpoints': userProfileService.getUserStarpoints(), //Количество Starpoints
                    //        'Balanse': userProfileService.getUserRealpoints(), //Количество Realpoints
                    //        'Status': userProfile.userData.active, //Статус пользователя - True, Banned
                    //        'Experience': userProfile.userData.experience, //Текущий опыт пользователя
                    //        'Level': userProfile.level //Уровень акканта на GameStars
                    //    });
                    //}
                })
                .then(function () {
                    //TODO: ?
                    $http({
                        method: 'POST',
                        url: '/index.php?login/login',
                        data: $.param({login: $scope.loginEmail, password: $scope.loginPass, cookie_check: 1}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                })
                //текущий статус по матчам
                .then(function () {
                    return $http
                        .get('/api/' + config.template + '/match/status/user')
                        .then(function (response) {
                            if (response.data.actualMatchApplications.length > 0) {
                                localStorage.setItem('application_id', response.data.actualMatchApplications[0].id);
                                localStorage.setItem('currencyType', response.data.actualMatchApplications[0].currencyType);
                                localStorage.setItem('dirtyStatus', response.data.actualMatchApplications[0].dirty);
                            }

                            var acceptedCount = 0;

                            if (response.data.actualMatches.length > 0) {
                                response.data.actualMatches.forEach(function (match) { //Текущий статус матча, в котором участвует пользователь
                                    if (!match){ //TODO: ?
                                        return;
                                    }

                                    localStorage.setItem('roomId', match.id);

                                    if (match.status === 'PREPARE') {
                                        acceptedCount = match.acceptedCount;
                                        return;
                                    }

                                    openMatchWindow(match.status);
                                });
                            }

                            response.data.actualMatchApplications.forEach(function (f) { //Текущий статус поиска матча
                                if (f !== null) {
                                    if (f.status == 'PREPARE') {
                                        findGameService.showTimer(f.id, f.createTime);
                                    }

                                    if (f.status == 'MATCHED' || f.status == 'ACCEPTED'){
                                        var accepted = f.status === 'ACCEPTED';

                                        openMatchAcceptModal(accepted, acceptedCount);
                                    }

                                    if (f.id) {
                                        $rootScope.application_id = f.id;
                                    }
                                }
                            });
                        })
                        .catch(function (err) {
                            console.warn('admin data parse error', err);
                        });

                });
        }

        /**
         * Открытие окна подтверждения готовности к матчу
         * @param {boolean} [accepted=false] - нажал ли пользователь кнопку "готов"
         * @param {number} [acceptedCount] - кол-во пользователей, нажавших "готов"
         */
        function openMatchAcceptModal(accepted, acceptedCount) {
            var options = { size: 'sm', backdrop: 'static', controller: 'IAmReadyForGameController' };
            var data = { accepted: !!accepted, acceptedCount: acceptedCount };
            $rootScope.modalInstance = modalService.openModal('acceptwindow.html', options, data);
            $rootScope.modalInstance.opened.then(function () {
                Analytics.trackEvent('match', 'finded', '', {
                    type: localStorage.getItem('gameType'),
                    bet: localStorage.getItem('currentbit'),
                    betType: localStorage.getItem('currencyType'),
                    tourId: localStorage.getItem('currenttourId'),
                    server: localStorage.getItem('currenttourRegion')
                });
            });
        }

        /**
         * Открытия окна с предложением повторно встать в очередь
         */
        function openReacceptModal() {
            $rootScope.modalInstance && $rootScope.modalInstance.close();
            $rootScope.modalInstance = modalService.openModal('reaccept.html', { size: 'sm', backdrop: 'static' });
        }
        
        function showEmailValidationMessage() {
            var userProfile = userProfileService.getUserProfile();
            
            return userProfile && userProfile.userData && !userProfile.userData.emailValidated
        }

        /**
         * Отображать ли сообщение о неподдерживаемом браузере
         * @return {boolean | undefined}
         */
        function showOldBrowserMessage() {
            if (!userProfileService.getUserProfile()) {
                return undefined;
            }

            var unsupportedBrowser =
                /MSIE/i.test(navigator.userAgent) || //IE 9-11
                /rv:11.0/i.test(navigator.userAgent) || //IE 11
                /Edge/i.test(navigator.userAgent) || //Edge
                /firefox/i.test(navigator.userAgent); //FF
            return unsupportedBrowser || !socketService.isWebSocketSupported();
        }
        
        function resendEmail() {
            var email = getUserEmail();

            vm.resendEmail.loading = true;

            userProfileService
                .restorePassword(email)
                .then(function () {
                    vm.resendEmail.success = true;
                    notificationService.success('REMINDER__CONFIRM_EMAIL_SENT');
                })
                .finally(function () {
                    vm.resendEmail.loading = false;
                });
        }
        
        function getUserEmail() {
            var userProfile = userProfileService.getUserProfile();
            return userProfile && userProfile.userData.email;
        }
        
        function resendEmail() {
            var email = getUserEmail();

            vm.resendEmail.loading = true;

            userProfileService
                .restorePassword(email)
                .then(function () {
                    vm.resendEmail.success = true;
                    notificationService.success('REMINDER__CONFIRM_EMAIL_SENT');
                })
                .finally(function () {
                    vm.resendEmail.loading = false;
                });
        }
        
        function getUserEmail() {
            var userProfile = userProfileService.getUserProfile();
            return userProfile && userProfile.userData.email;
        }
    }

})();

