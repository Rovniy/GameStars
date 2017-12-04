(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('AppController', AppController);

    AppController.$inject = [
        '$scope', '$http', '$cookies'];

    function AppController($scope, $http, $cookies) {
        $scope.accountTrouble = false;
        $scope.UserExistException = false;
        $scope.checkAccount = checkAccount;
        $scope.register = register;
        $scope.newkey = [];
        $scope.waitPendingRest = false;

        activate();

        function activate() {
            ga(function(tracker) {
                document.cookie = "_ga_cid=" + tracker.get('clientId') + "; path=/"; // save it to cookie _ga_cid
                ga('set', 'dimension1', tracker.get('clientId')); //get client id from  Google Analytics, запись clientId для каждого пользователя
            });

            $scope.utmSearch = window.location.search.substr(1), $scope.keys = {};
            $scope.utmSearch.split('&').forEach(function(item) {
                item = item.split('=');
                $scope.keys[item[0]] = item[1];
            });
        }

        // Нажатие на кнопку регистрации
        function register() {
            $scope.UserExistException = false;
            $scope.ValidationException = false;
            $scope.accountTrouble = false;

            $scope.utmSearch = window.location.search.substr(1), $scope.keys = {};
            $scope.utmSearch.split('&').forEach(function(item) {
                item = item.split('=');
                var newObj = {
                    'name': item[0],
                    'value': item[1]
                };
                $scope.newkey.push(newObj);
            });

            var data =  {
                "email": undefined,
                "name": undefined,
                "password": undefined,
                "acceptConditions": "true",
                "referralId": undefined,
                "tz": undefined,
                "autoLogin": 0,
                'additionalIds': [
                    { "name" : "clientId", "value" :  $cookies.get('_ga_cid')}
                ]
            };
            if ($scope.utmSearch.length > 0) {
                $scope.newkey.forEach(function(f){
                    data.additionalIds.push(f);
                });
                data.email =  $scope.email;
                data.name =  $scope.nickname;
                data.password = $scope.password;
                data.referralId = $scope.refLink;
                data.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
            } else {
                data.email =  $scope.email;
                data.name =  $scope.nickname;
                data.password = $scope.password;
                data.referralId = $scope.refLink;
                data.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
            }

            $http.post('/api/signup', data)
                .then(function (response) {
                    ga('send', 'event', 'registration', 'submit', '');
                    addAccount();
                })
                .catch(function (response) {
                    $scope.waitPendingRest = false;
                    // Email занят
                    if (response.data.error.type == 'UserExistException') {
                        $scope.UserExistException = true;
                    }
                    // Username занят
                    if (response.data.error.type == 'ValidationException') {
                        $scope.ValidationException = true;
                    }
                    if (response.data.error.type == 'UserUnverifiedException') {
                        $scope.UserExistException = true;
                    }
                });
        }

        // Привязка аккаунта
        function addAccount() {
            ga('game_account', 'add', '', {
                game: 'lol',
                location: $scope.serverArea,
                game_username: $scope.gameaccount
            });

            var account = {
                "regionId" : $scope.serverArea,
                "summonerName": $scope.gameaccount
            };
            $http.post('/api/lol/add', account)
                .then(function () {
                    window.location.href = 'http://gamestars.gg';
                })
                .catch(function () {
                    $scope.waitPendingRest = false;
                    console.log('Ошибка добавления аккаунта', response)
                });
        }


        // Проверка возможности привязки аккаунта
        function checkAccount() {
            $scope.UserExistException = false;
            $scope.ValidationException = false;
            $scope.accountTrouble = false;
            $scope.accuntLvlSoSmall = false;
            $scope.GameRestrictionException = false;
            $scope.waitPendingRest = true;

            var account = {
                "regionId" : $scope.serverArea,
                "summonerName": $scope.gameaccount
            };
            $http.post('/api/lol/check', account)
                .then(function () {
                    register();
                })
                .catch(function (response) {
                    $scope.waitPendingRest = false;
                    if (response.data.error.type == 'AccountNotFoundException') {
                        $scope.accountTrouble = true;
                    }  else if (response.data.error.type == 'GameRestrictionException') {
                        $scope.GameRestrictionException = true;
                    } else if (response.data.error.type == 'AccountAlreadyExistException') {
                        $scope.AccountAlreadyExistException = true;
                    }
                });

        }
    }
})();

