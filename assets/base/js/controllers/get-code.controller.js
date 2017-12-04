(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('GetCodeController', GetCodeController);

    GetCodeController.$inject = ['$scope', '$http'];

    /* @ngInject */
    function GetCodeController($scope, $http) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            // Получение кода
            $http
                .get('/api/code')
                .then(function (response) {
                    $scope.personalCodeConnect = response.data.data;
                })
                .catch(function (rejection) {
                    console.error('/api/code error: ', rejection);
                });
        }
    }

})();

