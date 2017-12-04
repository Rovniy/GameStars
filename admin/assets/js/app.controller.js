(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$http', '$rootScope', '$location', '$uibModal'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {angular.IHttpService} $http
     * @param $rootScope
     * @param {angular.ILocationService} $location
     * @param {angular.ui.bootstrap.IModalService} $uibModal
     * @constructor
     */
    function AppController($scope, $http, $rootScope, $location, $uibModal) {
        $scope.baseSiteUrl = window.location.host.replace(/admin./g, '');

        $rootScope.getUserProfile = function () {
            $http
                .get('/api/profile')
                .then(function(response) {
                    if (response.data.data.userData.role == "ADMIN" || response.data.data.userData.role == "SUPPORT") {
                        $rootScope.userProfile = response.data.data;
                    }
                    else {
                        window.location.href = 'login.html?returnUrl=' + decodeURI($location.path());
                    }
                })
                .catch(function () {
                    window.location.href = 'login.html?returnUrl=' + decodeURI($location.path());
                });
        };
        if (window.location.pathname !== '/login.html') {
            $rootScope.getUserProfile();
        }

        //Логин на сайт
        $scope.loginAdmin = function () {
            var data = {
                "email": $scope.loginUserName,
                "password": $scope.loginPassword
            };

            $scope.loginBtnDisable = true;

            $http
                .post('/api/login', data)
                .then(function () {
                    var returnUrl = $location.search().returnUrl;
                    if (returnUrl) {
                        window.location.href = decodeURI(returnUrl);
                    }
                    else {
                        window.location.href = '/';
                    }
                })
                .finally(function () {
                    $scope.loginBtnDisable = false;
                });
        };

        // Logout пользователя с сайта
        $scope.logout = function(){
            $http.get('/api/logout')
                .then(function (response) {
                    $rootScope.userProfie = null;
                    window.location.href = 'login.html';
                }, function (response) {
                    alert('Ошибка выхода с сайта');//todo: заменить на нотификацию
                });
        };

        $rootScope.goto = function(type,data) {
            $location.path('/' + type + '/' + data + '/');
            //window.location.href = type + '/' + data + '/';
        };


        $rootScope.rootSet = function(key, value){
            //console.log('rootSet: ', key, value);
            $rootScope[key] = value;
            //console.log('$rootScope: ', $rootScope);
        };

        $rootScope.modal = function(size, path, data) {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'html/modal/' + path,
                size: size,
                $scope: data
            });
        };
    }

})();

