(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('topList', topList);

    topList.$inject = ['$scope', '$http', '$routeParams', '$timeout', 'config', 'tournamentService', 'modalService'];

    /* @ngInject */
    /**
     * Страница инфы по пользователю
     * @param $scope
     * @param {angular.IHttpService} $http
     * @param $routeParams
     * @param $timeout
     * @param config
     * @param {tournamentService} tournamentService
     * @param {Admin.modalService} modalService
     * @constructor
     */
    function topList($scope, $http, $routeParams, $timeout, config, tournamentService, modalService) {
        var vm = this;

        vm.winrateReverse = true;

        activate();

        ////////////////

        function activate() {
            $http.get('/api/adm/top-users')
                .then(function(response) {
                    vm.ratingData = response.data.data;
                })
                .catch(function () {
                    console.log('Admin: Не могу получить данные о рейтинге пользователей');
                });

        }


    }
})();