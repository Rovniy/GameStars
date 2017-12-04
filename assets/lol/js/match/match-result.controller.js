(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('MatchResultController', MatchResultController);

    MatchResultController.$inject = [
        '$scope', '$http', '$rootScope', '$translate',
        'Analytics', 'config', 'modalService', 'userProfileService'];

    /* @ngInject */
    /**
     * Контроллер, который отвечает за вывод результатов матча
     * @param $scope
     * @param $http
     * @param $rootScope
     * @param $translate
     * @param {Analytics} Analytics
     * @param {config} config
     * @param {modalService} modalService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function MatchResultController($scope, $http, $rootScope, $translate,
                                   Analytics, config, modalService, userProfileService) {
        $scope.closeResultWindow = closeResultWindow;
        $scope.openIssueModal = openIssueModal;
        $scope.openPaymentModalInMatch = openPaymentModalInMatch;

        activate();

        /////////////////////

        function activate() {
            //Получение ID комнаты
            var roomId = localStorage.getItem('roomId');
            var roomUrl = '/api/' + config.template + '/match/' + roomId + '/result';
            var playerId;

            userProfileService
                .loadUserProfile()
                .then(function (userProfile) {
                    playerId = userProfile.userData.id;
                    $scope.currentlvl = userProfile.level;

                    return $http.get(roomUrl);
                })
                .then(function (response) {
                    var data = response.data.data;

                    $scope.bet = data.bet;
                    $scope.betType = data.match_info.bet_type;
                    $scope.matchMode = data.match_info.mode === 'tournament' ? 'MATCH_RESULT__TOURNAMENT' : 'MATCH_RESULT__MATCH';

                    if (_isMyTeam(data.team_one, playerId)){
                        $scope.myTeam = data.team_one;
                        $scope.enemyTeam = data.team_two;
                    }
                    else{
                        $scope.myTeam = data.team_two;
                        $scope.enemyTeam = data.team_one;
                    }

                    var duration = moment.duration(data.duration, 'seconds');
                    var durationHour = duration.hours();
                    var durationMin = duration.minutes();
                    var durationSec = duration.seconds();

                    if (durationHour > 0) {
                        $scope.playTime = _pad(durationHour) + ':' + _pad(durationMin) + ':' + _pad(durationSec);
                    }
                    else {
                        $scope.playTime = _pad(durationMin) + ':' + _pad(durationSec);
                    }

                    // Переменная, включающая измененное отображение полос оптыа
                    $scope.borderleft = 0;

                    if ($scope.exp + $scope.exp_delta > 100) {
                        $scope.exp_delta = $scope.exp + $scope.exp_delta - 100;
                        $scope.exp = 0;
                        $scope.borderleft = 1;
                        $scope.currentlvl++;
                    }

                    //Определение результатов
                    if (data.player_result) {
                        if (data.player_result.is_win) {
                            Analytics.trackEvent('match', 'cgames_banner20042016', '', {
                                mayBeWin: data.player_result.is_win,
                                exp: data.player_result.exp,
                                exp_delta: data.player_result.exp_delta,
                                winrate: data.player_result.winrate
                            });
                        }

                        $scope.mayBeWin = data.player_result.is_win; //Какой статус у меня? Выиграл ли я или проиграл?
                        $scope.exp = data.player_result.exp; //Сколько опыта пришло из запроса results.exp
                        $scope.exp_delta = data.player_result.exp_delta; //Сколько опыта добавилось из запроса results.exp_delta
                        $scope.betaward = data.player_result.award;

                        var winrate = data.player_result.winrate;
                        if (angular.isDefined(winrate)){
                            $scope.winrate1 = winrate.toString().split('.')[0];
                            $scope.winrate2 = winrate.toString().split('.')[1];
                        }
                    }

                    // Получили результаты
                    if ($scope.status == 'COMPLITED') {
                        Analytics.trackEvent('match', 'finished', '', {
                            bet: $scope.bet,
                            matchId: roomId
                        });
                    }

                })
                .catch(function () {
                    $translate('MATCH_NOTIFICATION__SERVER_ERROR').then(function (text) {
                        $scope.match = text;
                    });
                });
        }

        function closeResultWindow() {
            $rootScope.modalInstance.close();
        }

        function openIssueModal(playerId, userName) {
            var modalData = {
                playerId: playerId,
                userName: userName
            };

            modalService.openModal('issue.html', {size: 'md', controller: 'IssueModalController'}, modalData);
        }

        function openPaymentModalInMatch() {
            modalService.openModal('paymentInMatch.html');
        }

        /**
         * @param value
         * @return {string}
         * @private
         */
        function _pad(value) {
            return value > 9 ? '' + value : '0' + value;
        }

        /**
         * @param {[*]} team
         * @param {string} playerId
         * @return {boolean}
         * @private
         */
        function _isMyTeam(team, playerId) {
            if (!team){
                return false;
            }

            for (var i = 0; i < team.length; i++){
                if (team[i].player_id === playerId){
                    return true;
                }
            }

            return false;
        }
    }

})();

