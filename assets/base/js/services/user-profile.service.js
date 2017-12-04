(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('userProfileService', userProfileService);

    userProfileService.$inject = ['$http', '$q', '$cookies', 'config'];

    /* @ngInject */
    /**
     * Сервис для получения и изменения профиля
     * @param {angular.IHttpService} $http
     * @param {angular.IQService} $q
     * @param $cookies
     * @param {config} config
     */
    function userProfileService($http, $q, $cookies, config) {
        /** @type {UserProfile} */
        var userProfile = undefined;
        var currencyDict = {};
        /** @type {angular.IPromise<*>} */
        var loaderPromise = null;

        this.resetUserProfile = resetUserProfile;
        this.loadUserProfile = loadUserProfile;
        this.reloadUserProfile = reloadUserProfile;
        this.getUserProfile = getUserProfile;
        this.isAdmin = isAdmin;
        this.getUserStarpoints = getUserStarpoints;
        this.getUserRealpoints = getUserRealpoints;
        this.getUserRealpointsVip = getUserRealpointsVip;
        this.getUserRealpointsBonus = getUserRealpointsBonus;
        this.getAvatarUrl = getAvatarUrl;
        this.updateAvatarId = updateAvatarId;
        this.updateUsername = updateUsername;
        this.updatePassword = updatePassword;
        this.updateProfile = updateProfile;
        this.deleteGameAccount = deleteGameAccount;
        this.connectAccount = connectAccount;
        this.refreshAccountData = refreshAccountData;
        this.submitPromoCode = submitPromoCode;
        this.isVipStatus = isVipStatus;
        this.currencyUpdated = currencyUpdated;
        this.restorePassword = restorePassword;

        ////////////////

        /**
         * Обработка события изменения счета пользователя
         * @param {UserCurrencyUpdateData} data
         */
        function currencyUpdated(data) {
            if (!userProfile) {
                return;
            }

            /** @type {UserCurrency} */
            var currency;

            for (var i = 0; i < userProfile.userData.currencyList.length; i++) {
                var tmp = userProfile.userData.currencyList[i];

                // если не TOURNAMENT_POINTS, то не сравниваем tournamentId
                if (tmp.id.type === data.currencyType && (tmp.id.tournamentId === data.tournamentId || data.currencyType !== 'TOURNAMENT_POINTS')) {
                    currency = tmp;
                    break;
                }
            }

            currency = currency || {
                    id: {
                        type: data.currencyType,
                        tournamentId: data.currencyType === 'TOURNAMENT_POINTS' ? data.tournamentId : -1
                    },
                    updateTime: Date.now()
                };

            currency.count = data.count.main;
            currency.bonus = data.count.bonus;
        }

        function resetUserProfile() {
            userProfile = undefined;
            currencyDict = {};
            loaderPromise = null;
        }

        /**
         * Загрузка профиля пользователя
         * @returns {angular.IPromise<UserProfile>}
         */
        function loadUserProfile() {
            //console.log('coockies', $cookies.getAll());
            var cid = $cookies.get('_ga_cid');

            //console.log('loadUserProfile '+ cid);
            // предотвращение параллельных запросов
            if (!loaderPromise) {
                loaderPromise = $http
                    .get('/api/profile?clientId=' + cid)
                    .then(loadUserProfileComplete)
                    .catch(loadUserProfileFailed);
            }

            return loaderPromise;

            function loadUserProfileComplete(response) {
                console.log('UserProfile: user profile loaded');

                userProfile = response.data.data;
                loaderPromise = $q.when(userProfile);
                return userProfile;
            }

            function loadUserProfileFailed(error) {
                loaderPromise = null;
                return $q.reject(error);
            }
        }

        /**
         * @returns {angular.IPromise<UserProfile>}
         */
        function reloadUserProfile() {
            loaderPromise = null;
            return loadUserProfile().then(function (userProfile) {
                currencyDict = {};
                return userProfile;
            });
        }

        /**
         * Запрос на обновление аватарки в профиле
         * @param {number} avatarId
         * @returns {angular.IPromise<void>}
         */
        function updateAvatarId(avatarId) {
            return $http
                .get('/api/icon/' + avatarId)
                .then(updateAvatarIdComplete)
                .catch(updateAvatarIdFailed);

            function updateAvatarIdComplete() {
                userProfile.userData.avatarId = avatarId;
            }

            function updateAvatarIdFailed() {
                return $q.reject();
            }
        }

        /**
         * Изменение имени пользователя
         * @param {string} username
         * @returns {angular.IPromise<void>}
         */
        function updateUsername(username) {
            var data = {name: username};

            return $http
                .post('/api/accounts/name/change', data)
                .then(updateUsernameComplete)
                .catch(updateUsernameFailed);

            function updateUsernameComplete() {
                userProfile.userData.name = username;
            }

            function updateUsernameFailed() {
                return $q.reject();
            }
        }

        /**
         * Изменение пароля пользователя
         * @param {string} oldPwd
         * @param {string} newPwd
         * @returns {angular.IHttpPromise<void>}
         */
        function updatePassword(oldPwd, newPwd) {
            var data = {
                "oldPassword": oldPwd,
                "newPassword": newPwd
            };

            return $http.post('/api/accounts/password/change', data);
        }

        /**
         * Обновление профиля пользователя
         * @param profileData
         * @returns {angular.IHttpPromise<*>}
         */
        function updateProfile(profileData) {
            return $http.post('/api/profile', profileData);
        }

        /**
         * @returns {UserProfile}
         */
        function getUserProfile() {
            return userProfile;
        }

        /**
         * @returns {boolean}
         */
        function isAdmin() {
            return userProfile && userProfile.userData.role === "ADMIN";
        }

        /**
         * @returns {number|undefined}
         */
        function getUserStarpoints() {
            if (!userProfile) {
                return undefined;
            }

            var currency = _getCurrency('STAR_POINTS');

            return currency ? currency.count : 0;
        }

        /**
         * @returns {number|undefined}
         */
        function getUserRealpoints() {
            if (!userProfile) {
                return undefined;
            }

            var currency = _getCurrency('REAL_POINTS');

            return currency ? currency.count + currency.bonus : 0;
        }

        /**
         * @returns {number|undefined}
         */
        function getUserRealpointsVip() {
            if (!userProfile) {
                return undefined;
            }

            var currency = _getCurrency('REAL_POINTS');

            return currency ? currency.count : 0;
        }

        /**
         * @returns {number|undefined}
         */
        function getUserRealpointsBonus() {
            if (!userProfile) {
                return undefined;
            }

            var currency = _getCurrency('REAL_POINTS');

            return currency ? currency.bonus : 0;
        }

        /**
         * @returns {string|undefined}
         */
        function getAvatarUrl() {
            if (!userProfile) {
                return undefined;
            }

            return "/src/img/avatars/" + userProfile.userData.avatarId + ".jpg";
        }

        /**
         * @return {boolean}
         */
        function isVipStatus() {
            return userProfile && userProfile.userData.status === 'VIP';
        }

        /**
         * Удаление игрового аккаунта
         * @param {string} gameType
         * @param {number} id
         * @returns {angular.IPromise<void>}
         */
        function deleteGameAccount(gameType, id) {
            var url = '/api/' + gameType + '/remove/' + id;

            return $http
                .get(url)
                .then(deleteGameAccountComplete);

            function deleteGameAccountComplete() {
                var accounts = userProfile.gameAccounts;

                for (var i = 0; i < accounts.length; i++) {
                    if (accounts[i].id === id) {
                        accounts.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * Добавление игорового аккаунта. Не обновляет userProfile.
         * @param regionId
         * @param summonerName
         * @returns {angular.IPromise<*>}
         */
        function connectAccount(regionId, summonerName) {
            var data = {
                "regionId": regionId,
                "summonerName": summonerName
            };

            return $http
                .post('/api/' + config.template + '/add', data)
                .then(function (response) {
                    ga('send', 'event', 'account', 'link', config.template);
                    return response;
                })
                .catch(function (response) {
                    return $q.reject(response.data.error);
                });
        }

        /**
         * @param {string} game
         * @returns {angular.IHttpPromise<void>}
         */
        function refreshAccountData(game) {
            return $http.post('/api/' + game + '/refresh', {});
        }

        /**
         * Активация промо-кода
         * @param {string} code
         * @returns {angular.IPromise<void>}
         */
        function submitPromoCode(code) {
            return $http
                .post('/api/reaction/promo/apply', {code: code})
                .catch(function (response) {
                    var errorType = (response.data.error && response.data.error.type) || '';
                    return $q.reject(errorType);
                });
        }

        /**
         * Восстановление пароля
         * @param {string} email
         * @return {angular.IHttpPromise<void>}
         */
        function restorePassword(email) {
            return $http.post('/api/accounts/password/reset', {email: email});
        }

        /**
         *
         * @param {string} currencyType
         * @return {UserCurrency}
         * @private
         */
        function _getCurrency(currencyType) {
            var currency = currencyDict[currencyType];

            if (!currency) {
                for (var i = 0; i < userProfile.userData.currencyList.length; i++) {
                    if (userProfile.userData.currencyList[i].id.type === currencyType) {
                        currency = currencyDict[currencyType] = userProfile.userData.currencyList[i];
                        break;
                    }
                }
            }

            return currency;
        }
    }

})();