(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', '$cookies', 'intercomService'];

    /* @ngInject */
    /**
     * 
     * @param $http
     * @param $cookies
     * @param {intercomService} intercomService
     */
    function authenticationService($http, $cookies, intercomService) {
        this.logout = logout;
        this.login = login;
        this.externalLogin = externalLogin;

        ////////////////

        /**
         * @returns {angular.IPromise<*>}
         */
        function logout() {
            return $http
                .get('/api/logout')
                .then(function () {
                    //$cookies.remove('_ga_cid');
                    intercomService.emit('authentication.logout');
                });
        }

        /**
         * @param {string} email
         * @param {string} password
         * @returns {angular.IPromise<*>}
         */
        function login(email, password) {
            var data =  {
                email: email,
                password: password
            };

            return $http
                .post('/api/login', data)
                .then(function (response) {
                    intercomService.emit('authentication.login');
                    console.log('success: ', response);
                });
        }

        /**
         * Авторизация через внешние ресурсы
         * @param provider, url - куда вернуть после успешной авторизации
         * @returns {angular.IPromise<*>}
         */
        function externalLogin(provider, url) {
            if (url) {
                localStorage.setItem('myFormerUrl', location.href);
            }
            $http.get('/api/authenticate/' + provider).then(function (response) {
                location.href = response.data.data.redirect_url;
            });

        }
    }

})();

