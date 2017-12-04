(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('FindTheGameNowController', FindTheGameNowController);

    FindTheGameNowController.$inject = ['$scope', '$rootScope', 'notificationService', 'findGameService'];

    /* @ngInject */
    /**
     * Контроллер, который срабатывает, когда пользователь начинает искать игру.
     * @param {angular.IScope} $scope
     * @param $rootScope
     * @param {notificationService} notificationService
     * @param {findGameService} findGameService
     * @constructor
     */
    function FindTheGameNowController($scope, $rootScope, notificationService, findGameService) {
        var vm = this;

        vm.disapply = disapply;
        vm.isTimerVisible = isTimerVisible;
        vm.getTimerValue = getTimerValue;

        activate();

        ////////////////

        function activate() {
            // WS: Встал в очередь
            $scope.$on('APPLICATION_APPLIED', onApplicationApplied);
        }

        function onApplicationApplied(e, data) {
            $rootScope.application_id = data.application_id;

            findGameService.showTimer(data.application_id);
            localStorage.setItem('application_id', data.application_id);
            notificationService.success('FIND_GAME_NOTIFICATION__YOU_START_TO_SEARCH');
        }

         // Кнопка отмены участия в игре
        function disapply() {
             findGameService.applicationDisapply();
        }
        
        function isTimerVisible() {
            return findGameService.isTimerVisible();
        }
        
        function getTimerValue() {
            return findGameService.getTimerValue();
        }
    }

})();

