(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('ReAcceptBitController', ReAcceptBitController);

    ReAcceptBitController.$inject = ['$scope', '$rootScope', '$http', 'config', 'notificationService', 'intercomService', 'Analytics'];

    /* @ngInject */
    /**
     * Контроллер, который срабатывает, когда приходит запрос на подтверждение ставки от пользователя
     * @param {angular.IScope} $scope
     * @param $rootScope
     * @param {angular.IHttpService} $http
     * @param {config} config
     * @param {notificationService} notificationService
     * @param {intercomService} intercomService
     * @param {Analytics} Analytics
     * @constructor
     */
    function ReAcceptBitController($scope, $rootScope, $http, config, notificationService, intercomService, Analytics) {
        var vm = this;

        vm.accept = accept;
        vm.cancel = cancel;

        activate();

        ////////////////

        function activate() {
            intercomService.on('ReAcceptBitController.onAccept', onAccept);
            intercomService.on('ReAcceptBitController.onCancel', onCancel);

            $scope.$on('$destroy', function () {
                intercomService.off('ReAcceptBitController.onAccept', onAccept);
                intercomService.off('ReAcceptBitController.onCancel', onCancel);
            });
        }

        //Согласиться поставить новую ставку
        function accept(force) {
            intercomService.emit('ReAcceptBitController.onAccept');

            //TODO: в трех местах одинаковый запрос. Вынести в сервис
            var url = '/api/' + config.template + '/match/apply';
            var data = {
                bid: localStorage.getItem('currentbit'), //Получение данных о текущей ставке
                tournamentId: localStorage.getItem('currenttourId'), //Получение ID турнира
                currencyType: localStorage.getItem('currencyType'),
                gameRegionId: localStorage.getItem('currenttourRegion'), //Получение региона турнира
                patry: localStorage.getItem('cashGamesParty'),
                teamSize: localStorage.getItem('cashGamesTeamSize'),
                force: !!force
            };

            $http
                .post(url, data)
                .then(function () {
                    Analytics.trackEvent('match', 'start', '', {
                        type: localStorage.getItem('gameType'),
                        bet: localStorage.getItem('currentbit'),
                        betType: localStorage.getItem('currencyType')
                    });
                })
                .catch(function (response) {
                    Analytics.trackEvent('match', 'failed', '', {
                        type: localStorage.getItem('gameType'),
                        bet: localStorage.getItem('currentbit'),
                        betType: localStorage.getItem('currencyType'),
                        reason: response.data.error.type
                    });

                    notificationService.info(getErrorText(response.data.error.type));
                });
        }

        //Нажатие на кнопку отмены
        function cancel() {
            intercomService.emit('ReAcceptBitController.onCancel');
        }

        function onAccept() {
            $rootScope.modalInstance && $rootScope.modalInstance.close(); //Закрытие окна
        }

        function onCancel() {
            $rootScope.modalInstance && $rootScope.modalInstance.close();
        }

        function getErrorText(errorType) {
            switch (errorType){
                case 'NotPlayingTimeException':
                    return 'TOURNAMENT_NOTIFICATION__TIME_IS_OVER';

                case 'AccountBlockException':
                    return 'TOURNAMENT_NOTIFICATION__ACCOUNT_BLOCKED';

                case 'HaveViolationException':
                    return 'TOURNAMENT_NOTIFICATION__ACCOUNT_BLOCKED';

                case 'NotEnoughCostsException':
                    return 'TOURNAMENT_NOTIFICATION__YOU_HAVE_NOT_COST';

                case 'TournamentNotStartedException':
                    return 'TOURNAMENT_NOTIFICATION__TOURNAMENT_NOT_STARTED';

                default:
                    return 'TOURNAMENT_NOTIFICATION__ERROR';
            }
        }
    }

})();

