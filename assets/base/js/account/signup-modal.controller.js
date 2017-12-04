(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('SignupModalController', SignupModalController);

    SignupModalController.$inject = [
        '$scope', '$rootScope', '$uibModalInstance', '$http', '$cookies', '$location',
        'Analytics', 'authenticationService', 'userProfileService', 'modalService', 'modalData'
    ];

    /* @ngInject */
    /**
     *
     * @param $scope
     * @param {angular.IRootScopeService} $rootScope
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param $http
     * @param $cookies
     * @param {angular.ILocationService} $location
     * @param {Analytics} Analytics
     * @param {authenticationService} authenticationService
     * @param {userProfileService} userProfileService
     * @param {modalService} modalService
     * @param {{regionId: string}} modalData
     * @constructor
     */
    function SignupModalController($scope, $rootScope, $uibModalInstance, $http, $cookies, $location,
                                   Analytics, authenticationService, userProfileService, modalService, modalData) {
        var vm = this;

        $scope.loading = false;
        $scope.regionId = modalData.regionId || '';

        $scope.cancelAndLoginShow = cancelAndLoginShow;
        $scope.signup = signup;
        vm.externalLogin = externalLogin;
        
        activate();

        ////////////////
        
        function activate() {
            Analytics.trackEvent('signup', 'popup_show', '', {});
        }

        /**
         * Закрывает текущее окно и открывает окно авторизации
         */
        function cancelAndLoginShow(){
            /** Close sign-up pop-up **/
            $uibModalInstance.dismiss('cancel');

            /** Open sign-in pop-up **/
            modalService.openModal('login.html', { controller: 'LoginModalController' });
        }

        function signup(caseId){

            // caseId == null // Обычная регистрация
            // caseId == 1 // Регистрация с верификацией LoL аккаунта и закидыванием в матчмейкинг

            $scope.loading = true;
            $scope.refLink = $cookies.get('refLinkId');
            $scope.utmSearch = window.location.search.substr(1), $scope.keys = {};
            $scope.utmSearch.split('&').forEach(function(item) {
                item = item.split('=');
                $scope.keys[item[0]] = item[1];
            });

            
            var data =  {
                "email": $scope.signupEmail,
                "name": $scope.signupLogin,
                "password": $scope.signupPass,
                "acceptConditions": "true",
                "referralId": $scope.refLink,
                "additionalIds": [
                    { "name" : "clientId", "value" :  $cookies.get('_ga_cid')},
                    $scope.keys
                ],
                "tz": new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1],
                "autoLogin": caseId
            };

            $http
                .post('/api/signup', data)
                .then(function (response) {
                    ga('send', 'event', 'registration', 'submit', '');

                    if(caseId == 1) {
                        Analytics.trackEvent('registration', 'submit', '', {
                            'cashgamesPlay': true
                        });

                    }
                    else {
                        Analytics.trackEvent('registration', 'submit', '', {});
                    }
                })
                .then(function () {
                    // Вызов диалога первой сессии
                    $rootScope.$broadcast('play-first-session');
                    // авторизуемся после регистации

                    var promocode = localStorage.getItem('promocode');
                    if (promocode) {
                        localStorage.removeItem('promocode');
                        var dataCode = {
                            'code':promocode
                        };
                        $http.post('/api/reaction/promo/apply', dataCode);
                    }
                    if ($rootScope.redirectToTour) {
                        $uibModalInstance.dismiss('cancel');
                        $location.url('/tournament/lol/' + $rootScope.redirectToTour);
                    }

                    return authenticationService.login(data.email, data.password);
                })
                .then(function () {
                    $scope.modalSendComplate = true;
                    $scope.modalSendError = false;

                    if(caseId == 1) {
                        // Регаем юзера, логиним, привязываем LoL аккаунт, закидываем в матчмейкинг

                        Analytics.trackEvent('game_account', 'add', '', {
                            game: 'lol', //
                            location: $scope.regionId,
                            game_username: $scope.signupLogin
                        });

                        return userProfileService
                            .connectAccount($scope.regionId, $scope.signupLogin)
                            .then(function (response) {
                                //дожидаемся загрузки профиля
                                return userProfileService.loadUserProfile();
                            })
                            .then(function(){
                                // Закрываем попап
                                $uibModalInstance.close();
                            })
                            .catch(function (response) {
                                // Показываем ошибку
                                // @TODO
                                console.log(response);
                            });
                    }
                })
                .catch(function (response) {
                    $scope.modalSendError = true;
                    $scope.status = response.status;

                    try {
                        $scope.errorType = response.data.error.type;

                        switch ($scope.errorType){
                            case 'UserUnverifiedException':
                                $scope.errorMsg = 'SIGN_UP__EMAIL_UNVERIFIEDEXCEPTION';
                                break;

                            case 'UserExistException':
                                $scope.errorMsg = 'SIGN_UP__EMAIL_OR_LOGIN_ALREADY_USED';
                                break;

                            case 'ValidationException':
                                $scope.errorMsg = 'SIGN_UP__EMAIL_OR_LOGIN_ALREADY_USED';
                                if(response.data.error.message && response.data.error.message.name){
                                    switch(response.data.error.message.name[0]){
                                        case 'Name already taken':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__NAME_ALREADY_TAKEN';
                                            break;
                                        case 'AccountAlreadyExistException':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__SUMMONER_NAME_JOIN_TO_ANOTHER_ACCOUNT';
                                            break;
                                        case 'AccountAlreadyLinkException':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__SUMMONER_NAME_JOIN_TO_ANOTHER_SERVER';
                                            break;
                                        case 'AccountNotFoundException':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__SUMMONER_NAME_NOT_FOUND';
                                            break;
                                        case 'RiotApiException':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__ERROR';
                                            break;
                                        case 'PersistenceException':
                                            $scope.errorMsg = 'CONNECT_ACCOUNT__ERROR_REFER_TO_ADMIN';
                                            break;
                                    }
                                }
                                break;

                            default:
                                $scope.errorMsg = 'SIGN_UP__SERVER_ERROR_MSG';
                                break;
                        }

                    } catch (err){
                        console.warn('errorType parse err: ', err);
                    }
                })
                .finally(function () {
                    $scope.loading = false;
                });
        }

        function externalLogin(provider, url) {
            authenticationService.externalLogin(provider, url);
        }
    }

})();

