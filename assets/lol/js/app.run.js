(function () {
    'use strict';

    angular
        .module('gamestar')
        .run(run);

        run.$inject = ['$rootScope', '$timeout', 'Analytics', 'socketService'];

    /* @ngInject */
    /**
     * @param {angular.IRootScopeService} $rootScope
     * @param {angular.ITimeoutService} $timeout
     * @param {Analytics} Analytics
     * @param {socketService} socketService
     */
    function run ($rootScope, $timeout, Analytics, socketService) {
        Analytics.identify();

        // Если человек пришёл по реферальной ссылке
        if (window.location.search.match(/[?&]ref=/)) {
            var refLinkId = window.location.search.replace(/[?&]ref=/, '');
            document.cookie = "refLinkId=" + refLinkId;
        }

        socketService.addHandler(function (m) {
            //Analytics.trackEvent() //todo
            // $timeout для запуска $digest
            $timeout(function () {
                $rootScope.$broadcast(m.message_type, m);
                track(m.message_type);
            });
        });

        /**
         * @param event
         */
        function track(event) {
            switch (event) {
                case 'APPLICATION_APPLIED': //Начался подбор игроков - появляется окно в хедере
                    Analytics.trackEvent('match', 'start', 'socket', getAnalyticsData());
                    break;

                case 'APPLICATION_DISAPPLIED': //Начался подбор игроков - появляется окно в хедере
                    Analytics.trackEvent('match', 'declined', 'socket', getAnalyticsData());
                    break;

                case 'APPLICATION_TIMEOUT': //Вышло время подбора участников. Закрываем окно поиска в хедере
                    Analytics.trackEvent('match', 'timeout', 'socket', getAnalyticsData());
                    break;

                case 'APPLICATION_ACCEPTED': //приходит инфо о количестве подтвержденных участников в игре. Отображаем иконки готовых юзеров
                    break;

                case 'APPLICATION_RANGEUP': //Расширился диапазон поиска. Ничего не делаем
                    break;

                case 'APPLICATION_DECLINED': //Один из участников отменил готовноть. Зыкрываем модальное окно
                    //Analytics.trackEvent('match', 'cancel', 'socket', {});
                    break;

                case 'APPLICATION_MATCHED': //подбор окончен, сформированны команды, нужно подтвердить готовность. Появляется модальное окно подбора
                    Analytics.trackEvent('match', 'finded', 'socket', getAnalyticsData());
                    break;

                case 'APPLICATION_ROOM_TIMEOUT': //Вышло время подбора участников. Закрываем окно поиска в хедере
                    Analytics.trackEvent('match', 'ruined', 'other', angular.extend(getAnalyticsData(), {reason: 'timeout-other'}));
                    break;

                case 'APPLICATION_BROKEN': // WS: Если пришел BROKEN и из за тебя всех выкинуло
                    Analytics.trackEvent('match', 'ruined', 'you', angular.extend(getAnalyticsData(), {reason: 'timeout-other'}));
                    break;

                case 'MATCH_CREATED':// WS: Если команды сформированны
                    Analytics.trackEvent('match', 'create', 'socket', getAnalyticsData());
                    break;

                case 'MATCH_ACCEPTED':
                    break;

                case 'MATCH_TIME_UP': // Приходит сигнал на дополнительное время
                    break;

                case 'MATCH_DESTROYED': // Если сервер прислал сигнал о окончании матча и расформировании комнаты
                    Analytics.trackEvent('match', 'destroyed', 'socket', angular.extend(getAnalyticsData(), {reason: data.matchExtStatus}));
                    break;

                case 'MATCH_STARTED': // Если пришел сигнал о начале игры. Все подтвердили и все отлично!
                    Analytics.trackEvent('match', 'ready', 'socket', getAnalyticsData());
                    break;

                case 'MATCH_RESULTS_RECEIVED': // WS: если пришел COMPLITE матча
                    Analytics.trackEvent('match', 'completed', 'socket', getAnalyticsData());
                    break;

                default:
                    break;
            }

        }
        
        function getAnalyticsData() {
            return {
                type: localStorage.getItem('gameType'),
                bet: localStorage.getItem('currentbit'),
                betType: localStorage.getItem('currencyType'),
                tourId: localStorage.getItem('currenttourId'),
                server: localStorage.getItem('currenttourRegion')
            };
        }
    }

})();