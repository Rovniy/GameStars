(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkMainController', LkMainController);

    LkMainController.$inject = ['$scope', 'userProfileService', 'modalService', 'notificationService', 'statisticService'];

    /* @ngInject */
    /**
     * 
     * @param $scope
     * @param {userProfileService} userProfileService
     * @param {modalService} modalService
     * @param {notificationService} notificationService
     * @param {statisticService} statisticService
     * @constructor
     */
    function LkMainController($scope, userProfileService, modalService, notificationService, statisticService) {
        $scope.mainPageTabs = ['all', 'lol', 'hearthstone', 'dota', 'csgo']; //вкладки выбора игры

        $scope.getLevel = getLevel;
        $scope.getKills = getKills;
        $scope.getDeaths = getDeaths;
        $scope.getSpell1 = getSpell1;
        $scope.getSpell2 = getSpell2;
        $scope.getUserProfile = getUserProfile;
        $scope.getAvatarUrl = getAvatarUrl;
        $scope.reLoadTournaments = reLoadTournaments;
        $scope.openPromoCodeModal = openPromoCodeModal;
        $scope.openPaymentModal = openPaymentModal;

        var vm = this;

        activate();

        ////////////////

        function activate() {
            var userProfile = userProfileService.getUserProfile();
            if (userProfile){
                if (angular.isDefined(userProfile.userData.experience)) {
                    $scope.maxExp = userProfile.nextLevelExp;
                    $scope.persentExp = Math.floor( 100 / userProfile.nextLevelExp * userProfile.userData.experience );
                }
            }
        }

        /**
         * @param {string} tab
         */
        function reLoadTournaments(tab) {
            var game = tab === 'all' ? null : tab;

            statisticService
                .getTournaments(game)
                .then(function (tournaments) {
                    $scope.tournamentsData = tournaments.length ? tournaments : undefined;
                });

            statisticService
                .getRecentMatches(game)
                .then(function (matches) {
                    $scope.matchsData = matches.length ? matches : undefined;
                });
        }

        function getUserProfile(){
            return userProfileService.getUserProfile();
        }

        function getAvatarUrl(){
            return userProfileService.getAvatarUrl();
        }

        function getLevel(match){
            if (!match.statistic || !match.statistic.stats){
                return '';
            }
            return !angular.isUndefined(match.statistic.stats.champLevel) ?
                match.statistic.stats.champLevel : match.statistic.stats.level;
        }

        function getKills(match){
            if (!match.statistic || !match.statistic.stats){
                return '';
            }
            return !angular.isUndefined(match.statistic.stats.kills) ?
                match.statistic.stats.kills : match.statistic.stats.championsKilled;
        }

        function getDeaths(match){
            if (!match.statistic || !match.statistic.stats){
                return '';
            }
            return !angular.isUndefined(match.statistic.stats.deaths) ?
                match.statistic.stats.deaths : match.statistic.stats.numDeaths;
        }

        function getSpell1(match){
            if (!match.statistic){
                return '';
            }
            return !angular.isUndefined(match.statistic.spell1Id) ?
                match.statistic.spell1Id : match.statistic.spell1;
        }

        function getSpell2(match){
            if (!match.statistic){
                return '';
            }
            return !angular.isUndefined(match.statistic.spell2Id) ?
                match.statistic.spell2Id : match.statistic.spell2;
        }
        
        function openPromoCodeModal() {
            var instance = modalService.openModal('get-promo-code.html', { controller: 'PromoCodeModalController' });
            instance.result.then(userProfileService.reloadUserProfile);
        }

        function openPaymentModal() {
            modalService.openModal('payment.html');
        }
    }

})();
