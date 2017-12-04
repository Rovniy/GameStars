gamestar.controller('mainPageSlider', function ($scope, $rootScope) {
    $scope.myInterval = 3000;
    $scope.slides = [
        //{
        //    image: './img/main-nav_pic05.jpg',
        //    header: 'Привет призыватель',
        //    text: 'ПРОЧИТАЙ ПОЛЕЗНЕЙШУЮ ИНФОРМАЦИЮ О GAMESTARS',
        //    link: '#/info',
        //    class: ''

        //},
        {
            image: '/src/img/'+$rootScope.config.template +'/slide1.jpg',
            header: $rootScope.dict['MAIN_PAGE__OUR_WINNERS_BANNER_HEAD'],
            text: $rootScope.dict['MAIN_PAGE__OUR_WINNERS_BANNER_TEXT'],
            link: '#/tournament/lol/1',
            class: ''
        }
    ];
});
