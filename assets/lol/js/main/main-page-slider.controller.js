(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('MainPageSliderController', MainPageSliderController);

    MainPageSliderController.$inject = ['$scope'];

    /* @ngInject */
    function MainPageSliderController($scope) {
        $scope.myInterval = 3000;
        $scope.active = 0;
        $scope.slides = [
            //{
            //    image: './img/main-nav_pic05.jpg',
            //    header: 'Привет призыватель',
            //    text: 'ПРОЧИТАЙ ПОЛЕЗНЕЙШУЮ ИНФОРМАЦИЮ О GAMESTARS',
            //    link: '/info',
            //    class: ''

            //},
            {
                id: 0,
                image: '/src/img/lol/main-nav_pic01.jpg',
                header: 'MAIN_PAGE__OUR_WINNERS_BANNER_HEAD',
                text: 'MAIN_PAGE__OUR_WINNERS_BANNER_TEXT',
                link: '/halloffame',
                class: ''
            },
            {
                id: 1,
                image: '/src/img/lol/14-01-2016.jpg',
                header: 'MAIN_PAGE__NEW_YEAR_TOURNAMENT_GAMESTARS_BANNER_HEAD',
                text: 'MAIN_PAGE__NEW_YEAR_TOURNAMENT_GAMESTARS_BANNER_TEXT',
                link: '/tournament/lol/16',
                class: 'typeform-share'
            },
            {
                id: 2,
                image: '/src/img/lol/main-nav_pic09.jpg',
                header: 'MAIN_PAGE__REVIEWS_BANNER_HEAD',
                text: 'MAIN_PAGE__REVIEWS_BANNER_TEXT',
                link: '/reviews',
                class: ''
            }
        ];
    }

})();