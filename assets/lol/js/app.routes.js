(function () {
    'use strict';

    angular
        .module('gamestar')
        .config(config);

    config.$inject = ['$routeProvider'];

    /* @ngInject */
    function config ($routeProvider) {
        $routeProvider
            .when ('/', {
                templateUrl: '/main.html',
                controller: 'MainPageController',
                controllerAs: 'vm',
                resolve: {
                    userProfile: ['userProfileService', getUserProfile]
                }
            })
            .when ('/tournaments', {
                templateUrl: '/src/html/tournaments.html',
                controller: 'TournamentsRouteController',
                controllerAs: 'vm'
            })
            .when ('/cashgames', {
                templateUrl: '/cashGames.html',
                controller: 'CashGamesController',
                controllerAs: 'vm'
            })
            .when ('/tournament/lol/:id', {
                templateUrl: '/tournament-lol.html',
                controller: 'TournamentDetailsController',
                controllerAs: 'vm'
            })
            .when ('/tournament-rules', {
                templateUrl: '/src/html/tournament-rules.html'
            })
            // .when ('/news', {
            //     templateUrl: '/src/html/news.html'
            // })
            .when ('/faq', {
                templateUrl: '/src/html/faq.html',
                controller: 'FaqTabsQuestionsController',
                controllerAs: 'vm'
            })
            .when ('/referal', {
                templateUrl: '/src/html/referal.html',
                controller: 'ReferalController',
                controllerAs: 'vm'
            })
            .when ('/starclient', {
                templateUrl: '/src/html/starclient.html',
                controller: 'GetCodeController',
                controllerAs: 'vm'
            })
            .when ('/info', {
                templateUrl: '/info.html'
            })
            .when ('/bonus-faq', {
                templateUrl: '/src/html/bonusDescription.html'
            })
            .when ('/privacypolicy', {
                templateUrl: '/src/html/privacyPolicy.html'
            })
            .when ('/rules', {
                templateUrl: '/src/html/rules.html',
                controller: 'RulesController',
                controllerAs: 'vm'
            })
            .when ('/versions', {
                templateUrl: '/src/html/versions.html'
            })
            .when ('/halloffame', {
                templateUrl: '/src/html/halloffame.html'
            })
            .when ('/reviews', {
                templateUrl: '/src/html/reviews.html',
                controller: 'ReviewsController',
                controllerAs: 'vm'
            })
            .when ('/lk/:page', {
                templateUrl: '/src/html/lk.html',
                controller: 'LkController',
                resolve: {
                    userProfile: ['userProfileService', getUserProfile]
                }
            })
            .when ('/prize-info', {
                templateUrl: '/src/html/prize-info.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    /**
     * @param {userProfileService} userProfileService
     * @return {angular.IPromise<UserProfile>}
     */
    function getUserProfile(userProfileService){
        return userProfileService.loadUserProfile().catch(function(){ })
    }
})();