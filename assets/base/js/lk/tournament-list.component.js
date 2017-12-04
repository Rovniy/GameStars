(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .component('gsTournamentList', {
            templateUrl: '/src/html/lk/tournament-list.view.html',
            controller: TournamentListController,
            bindings: {
                tournaments: '<' // список турниров для отображения
            }
        });

    TournamentListController.$inject = ['$location', 'userProfileService', 'paymentService'];

    /* @ngInject */
    /**
     * @param {angular.ILocationService} $location
     * @param {userProfileService} userProfileService
     * @param {paymentService} paymentService
     * @property {*[]} tournaments
     * @constructor
     */
    function TournamentListController($location, userProfileService, paymentService) {
        var ctrl = this;

        ctrl.transactions = {};
        ctrl.currentSectionSpinner = -1;

        ctrl.onClick = onClick;
        ctrl.getTitleClass = getTitleClass;
        ctrl.getTournamentChips = getTournamentChips;
        ctrl.getTournamentBilling = getTournamentBilling;

        /**
         * @param {*} tournament
         */
        function onClick(tournament) {
            $location.path('tournament/lol/' + tournament.id); //TODO: LoL hardcode
        }

        function getTitleClass(tournament) {
            switch (tournament.status){
                case 'START':
                case 'FINISH':
                    return 'data-title-green';

                case 'PRE_REG':
                case 'POST_REG':
                    return 'data-title-blue';

                default:
                    return '';
            }
        }

        function getTournamentChips(tournament) {
            if (userProfileService.getUserProfile()){
                var currency = getTournamentCurrency(tournament.id);

                if (currency){
                    return currency.count;
                }
            }
        }

        function getTournamentBilling(id) {
            ctrl.currentSectionSpinner = id;

            if (!!ctrl.transactions[id]) {
                return;
            }

            paymentService
                .getTournamentTransactions(id)
                .then(function (transactions) {
                    ctrl.transactions[id] = transactions;
                });
        }

        function getTournamentCurrency(id) {
            var userProfile = userProfileService.getUserProfile();
            
            for (var i = 0; i < userProfile.userData.currencyList.length; i++){
                var currency = userProfile.userData.currencyList[i];

                if (currency.id.tournamentId === id){
                    return currency;
                }
            }
        }
    }

})();