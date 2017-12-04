(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('MatchesPageController', MatchesPageController);

    MatchesPageController.$inject = ['$scope', 'statisticService'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {statisticService} statisticService
     * @constructor
     */
    function MatchesPageController($scope, statisticService) {
        $scope.getLevel = getLevel;
        $scope.getKills = getKills;
        $scope.getDeaths = getDeaths;
        $scope.getSpell1 = getSpell1;
        $scope.getSpell2 = getSpell2;

        var vm = this;

        activate();

        ////////////////

        function activate() {
            return statisticService
                .getRecentMatches() //page=0&limit=20
                .then(function (matches) {
                    $scope.matchsData = matches.length ? matches : undefined;
                });
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
    }

})();