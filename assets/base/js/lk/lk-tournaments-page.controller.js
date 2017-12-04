(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('TournamentsPageController', TournamentsPageController);

    TournamentsPageController.$inject = ['$scope', 'Analytics', 'statisticService'];

    /* @ngInject */
    /**
     * @param $scope
     * @param Analytics
     * @param {statisticService} statisticService
     * @constructor
     */
    function TournamentsPageController($scope, Analytics, statisticService) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('lk_page', 'tournaments', '', {});
            
            return statisticService
                .getTournaments()
                .then(function (tournaments) {
                    $scope.tournamentsData = tournaments.length ? tournaments : undefined;
                });
        }
    }

})();

