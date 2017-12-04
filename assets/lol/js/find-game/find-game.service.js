(function () {
    'use strict';

    angular
        .module('gamestar')
        .service('findGameService', findGameService);

    findGameService.$inject = ['$http', '$interval', 'config', 'Analytics'];

    /* @ngInject */
    /**
     * 
     * @param {angular.IHttpService} $http
     * @param {angular.IIntervalService} $interval
     * @param {config} config
     */
    function findGameService($http, $interval, config, Analytics) {
        var _isTimerVisible = false;
        var intervalPromise;
        var intervalStartTime;
        var timerValue;
        
        this.applicationDisapply = applicationDisapply;
        this.isTimerVisible = isTimerVisible;
        this.showTimer = showTimer;
        this.hideTimer = hideTimer;
        this.getTimerValue = getTimerValue;

        ////////////////

        /**
         * @returns {boolean}
         */
        function isTimerVisible() {
            return _isTimerVisible;
        }

        /**
         * @param {string} applicationId
         * @param {number} [startTime = Date.now()]
         */
        function showTimer(applicationId, startTime) {
            var applicationInterval = getApplicationInterval();

            if (applicationInterval && applicationInterval.applicationId === applicationId){
                intervalStartTime = applicationInterval.startTime;
            }
            else{
                intervalStartTime = startTime || Date.now();
            }

            setApplicationInterval(applicationId, intervalStartTime);

            _isTimerVisible = true;
            intervalPromise = _updateTimer() || $interval(_updateTimer, 1000);
        }

        function hideTimer() {
            _isTimerVisible = false;
            localStorage.removeItem('applicationInterval');
            $interval.cancel(intervalPromise);
        }
        
        function getTimerValue() {
            return timerValue;
        }

        /**
         * @return {angular.IHttpPromise<void>}
         */
        function applicationDisapply() {
            var data = {
                applicationId: localStorage.getItem('application_id'),
                currencyType: localStorage.getItem('currencyType'),
                dirty: localStorage.getItem('dirtyStatus')
            };

            if (localStorage.getItem('currenttourId')){
                data.tournamentId = localStorage.getItem('currenttourId');
            }

            var r =  $http.post('/api/' + config.template + '/match/disapply', data).then(function (response) {
                Analytics.trackEvent('click', 'match', 'declined', {
                    type: localStorage.getItem('gameType'),
                    bet: localStorage.getItem('currentbit'),
                    betType: localStorage.getItem('currencyType'),
                    tourId: localStorage.getItem('currenttourId'),
                    server: localStorage.getItem('currenttourRegion')
                });
            });
            hideTimer();
            return r;
        }
        
        function _updateTimer() {
            var duration = moment.duration(Date.now() - intervalStartTime);
            var hours = duration.hours();
            var minutes = _pad(duration.minutes());
            var seconds = _pad(duration.seconds());

            if (hours > 0){
                timerValue = _pad(hours) + ':' + minutes + ':' + seconds;
            }
            else{
                timerValue = minutes + ':' + seconds;
            }
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
         * @return {ApplicationInterval}
         */
        function getApplicationInterval() {
            var json = localStorage.getItem('applicationInterval');
            if (json){
                return JSON.parse(json);
            }
        }

        function setApplicationInterval(applicationId, startTime) {
            var json = JSON.stringify({
                applicationId: applicationId,
                startTime: startTime
            });
            localStorage.setItem('applicationInterval', json);
        }
    }

})();