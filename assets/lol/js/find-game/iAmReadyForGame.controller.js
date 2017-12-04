(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('IAmReadyForGameController', IAmReadyForGameController);

    IAmReadyForGameController.$inject = [
        '$scope', '$interval', '$http', '$uibModalInstance',
        'config', 'notificationService', 'Analytics', 'modalData', 'modalService'
    ];

    /* @ngInject */
    /**
     * Контроллер, который отвечает за вывод диалоговых окон подтверждения и отклонения матчей
     * @param {angular.IScope} $scope
     * @param {angular.IIntervalService} $interval
     * @param {angular.IHttpService} $http
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {config} config
     * @param {notificationService} notificationService
     * @param {Analytics} Analytics
     * @param {{accepted: boolean, acceptedCount: number}} modalData - нажал ли пользователь "готов" и сколько пользователей уже нажало
     * @param {modalService} modalService
     * @constructor
     */
    function IAmReadyForGameController($scope, $interval, $http, $uibModalInstance,
                                       config, notificationService, Analytics, modalData, modalService) {
        var vm = this;
        var waittime = 60; //Время ожидания подтверждения в секундах

        vm.users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        vm.accepted = modalData.accepted || false; // нажал ли пользователь кнопку "готов"
        vm.somebodyDecline = false; //Если кто-нибудь отклонил предложение //TODO: нигде не меняется
        vm.acceptedCount = modalData.acceptedCount || 0; // кол-во пользователей, принявших матч
        vm.linewidth = 100; //Сколько процентов масимального значения?
        vm.loading = false;

        vm.onAcceptClick = onAcceptClick;
        vm.onCancelClick = onCancelClick;

        activate();

        ////////////////

        function activate() {
            // WS: При приеме количества пользователей, подтвердивших участие в игре
            $scope.$on('APPLICATION_ACCEPTED', onApplicationAccepted);

            var intervalPromise = $interval(function () {
                vm.linewidth -= 100 / waittime;
            }, 1000);

            $scope.$on('$destroy', function () {
                $interval.cancel(intervalPromise);
            });
        }

        /**
         * При приеме количества пользователей, подтвердивших участие в игре
         * @param e
         * @param {{accepted_count: number}} data
         */
        function onApplicationAccepted(e, data) {
            vm.acceptedCount = data.accepted_count;
        }

        /**
         * Реакция на нажатие кнопки "готов"
         */
        function onAcceptClick() {
            var currentUrl = '/api/' + config.template + '/match/accept';
            var data = {
                room_id: localStorage.getItem('roomId'),
                application_id: localStorage.getItem('application_id')
            };

            vm.loading = true;

            $http
                .post(currentUrl, data)
                .then(function () {
                    vm.accepted = true;

                    Analytics.trackEvent('match', 'accepted', '', {
                        type: localStorage.getItem('gameType'),
                        bet: localStorage.getItem('currentbit'),
                        betType: localStorage.getItem('currencyType'),
                        tourId: localStorage.getItem('currenttourId'),
                        server: localStorage.getItem('currenttourRegion')
                    });
                })
                .catch(function () {
                    notificationService.error('MATCH_NOTIFICATION__SERVER_ERROR');
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        /**
         * Реакция по нажатию на кнопку "Отмена" в окне "Матч найден!"
         */
        function onCancelClick() {
            var options = {backdrop: 'static'};
            var modalInstance = modalService.openModal('application-cancel-modal.view.html', options);
            modalInstance.result.then(cancelApplication);
        }

        /**
         * Отмена предложения вступления
         */
        function cancelApplication() {
            Analytics.trackEvent('match', 'cancel', '', {
                type: localStorage.getItem('gameType'),
                bet: localStorage.getItem('currentbit'),
                betType: localStorage.getItem('currencyType'),
                tourId: localStorage.getItem('currenttourId'),
                server: localStorage.getItem('currenttourRegion')
            });

            var data = {
                application_id: localStorage.getItem('application_id'),
                room_id: localStorage.getItem('roomId')
            };

            $http.post('/api/' + config.template + '/match/decline', data);

            notificationService.info('IM_READY_FOR_GAME_NOTIFICATION__YOU_CANCEL_PARTICIPATION');
            $uibModalInstance.dismiss();
        }
    }

})();

