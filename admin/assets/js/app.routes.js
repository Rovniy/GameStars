(function () {
    'use strict';

    angular
        .module('gsadmin')
        .config(config);

    config.$inject = ['$routeProvider'];

    /* @ngInject */
    function config ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'html/main.html'
            })
            .when('/users', {
                templateUrl: 'html/users.html',
                controller: 'users'
            }).when('/toplist', {
                templateUrl: 'html/toplist.html',
                controller: 'topList',
                controllerAs: 'vm'
            })
            .when('/user/:id', {
                templateUrl: 'html/user-page.html',
                controller: 'UserPageController',
                controllerAs: 'vm'
            })
            .when('/matches/:category', {
                templateUrl: 'html/match-list.html',
                controller: 'MatchListController',
                controllerAs: 'vm'
            })
            .when('/transactions/:category', {
                templateUrl: 'html/transactions.html'
            })
            .when('/applications', {
                templateUrl: 'html/applications.html',
                controller: 'ApplicationsController',
                controllerAs: 'vm'
            })
            .when('/tournament/create', {
                templateUrl: 'html/tournament-editor.html',
                controller: 'TournamentEditor',
                controllerAs: 'vm'
            })
            .when('/tournament/create/:cloneId', {
                templateUrl: 'html/tournament-editor.html',
                controller: 'TournamentEditor',
                controllerAs: 'vm'
            })
            .when('/tournament/edit/:id', {
                templateUrl: 'html/tournament-editor.html',
                controller: 'TournamentEditor',
                controllerAs: 'vm'
            })
            .when('/tournaments', {
                templateUrl: 'html/tournaments.html',
                controller: 'TournamentListController',
                controllerAs: 'vm'
            })
            .when('/tournament/:id', {
                templateUrl: 'html/tournament-info.html',
                controller: 'TournamentInfoController',
                controllerAs: 'vm'
            })
            .when('/tournament-rules', {
                templateUrl: 'html/tournament-rules.html',
                controller: 'tournamentRules'
            })
            .when('/promo-codes', {
                templateUrl: 'html/promo-codes.html',
                controller: 'PromoCodesController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();