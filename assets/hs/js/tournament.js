// Контроллер Турниров
gamestar.controller('tournaments', function ($scope, $http, $interval, $rootScope, $routeParams) {
    // Берем ключи турнира из URL
    $scope.params = $routeParams;
    // Вход в турнир
    $scope.joinTournament = function(){
        $scope.currentTournamentUrlJoin = '/api/tournament/'+ $scope.params.id +'/join';
        $http.post($scope.currentTournamentUrlJoin)
            .then(function successCallback(response) {
                window.sessionStorage.setItem('authStatus', null);
                window.location.href = window.location.href;
            }, function errorCallback(response) {
                console.log('error');
                if( response.data.error.type == 'NotFoundGameAccountException' ){
                    //$rootScope.modalAlertText('md', 'Вам нужно привязать аккаунт игры');
                    $scope.modal('md', 'connect-account.html')
                }
                if( response.data.error.type == 'UserWronglevelException' ){
                    $rootScope.modalAlertText('md', 'В турнир принимаются только игроки с профилями в LoL 30го уровня. Если у тебя есть такой аккаунт на EU West - обратись в техподдержку, чтобы прикрепить его. Если такого аккаунта нет - можешь попробовать достичь 30го уровня до конца регистрации в турнир (до 6 января 2016) и снова попробовать вступить в турнир.');
                }
                if( response.data.error.type == 'NotEnoughStarPointsException' ){
                    $rootScope.modalAlertText('md', 'Нехватает Starpoints для входа');
                }
                if( response.data.error.type == 'UserAlreadyRegisteredException' ){
                    $rootScope.modalAlertText('md', 'Вы уже в турнире');
                }
            })
        ;
    };

    // Данные с турнира
    $scope.regcountdown = {
        days : 0,
        hours : 0,
        minutes : 0
    };
    $scope.tournResult = {
        tournament_info : {
            blind_min : 0,
            blind_max : 5
        }
    };
    $scope.getBlindMinMaxStatus = false;
    $scope.currentTournamentUrlInfo = '/api/tournament/'+ $scope.params.id;

    $http.get($scope.currentTournamentUrlInfo)
    //$http.get('js/json' + $scope.params.id + '.json')
        .then(function successCallback(response) {
            $scope.tournResult = response.data.data;

            // начало турнира
            var date = $scope.toDateTime( $scope.tournResult.tournament_info.start_date );
            if( date.getMinutes() < 10 ){
                var dateMinutes = '0' + date.getMinutes();
            }else{
                var dateMinutes = date.getMinutes();
            }
            $scope.tournDateStart = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + dateMinutes;
            // окончание регистрации
            $interval(function(){
                var d = Number( $scope.tournResult.start_countdown );
                var days = Math.floor( d / 60 / 60 / 24);
                var hours = Math.floor( (d / 60 / 60) % 24 );
                var minutes = Math.floor( ( d / 60 ) % 60 );
                $scope.startcountdown = {
                    days : days,
                    hours : hours,
                    minutes : minutes
                };
                $scope.tournResult.start_countdown -= 1;
            }, 1000);

            // Поздняя регистрация
            $interval(function(){
                var d = Number( $scope.tournResult.reg_countdown );
                var days = Math.floor( d / 60 / 60 / 24);
                var hours = Math.floor( (d / 60 / 60) % 24 );
                var minutes = Math.floor( ( d / 60 ) % 60 );
                $scope.regcountdown = {
                    days : days,
                    hours : hours,
                    minutes : minutes
                };
                $scope.tournResult.reg_countdown -= 1;
            }, 1000);

            // До повышения минимальной ставки
            $interval(function(){
                var d = Number( $scope.tournResult.blind_countdown );
                var hours = Math.floor( (d / 60 / 60) % 24 );
                var minutes = Math.floor( ( d / 60 ) % 60 );
                $scope.blindcountdown = {
                    hours : hours,
                    minutes : minutes
                };
                $scope.tournResult.blind_countdown -= 1;
            }, 1000);

            // Slider UI
            $scope.price = $scope.tournResult.tournament_info.blind_min;
            setTimeout(function(){
                // slider UI
                $('#defSli').slider({
                    min: $scope.tournResult.tournament_info.blind_min,
                    max: $scope.tournResult.tournament_info.blind_max,
                    step: ($scope.tournResult.tournament_info.blind_max / 5),
                    range : 'min',
                    create: function( event, ui ) {
                        $('.ui-slider-handle').append('<span>' + $scope.tournResult.tournament_info.blind_min + '</span>');
                    },
                    slide: function(event, ui) {
                        $scope.$apply(function() {
                            $scope.price = ui.value;
                        });
                        $(ui.handle).children('span').text(ui.value);
                    }
                }).slider("pips",{
                    rest: "label"
                });
            }, 100);

            // Swipers
            var mySwiper1 = new Swiper ('.b-conditions-tour_prize-fund_swiper .swiper-container', {
                direction: 'vertical',
                loop: false,
                nextButton: '.b-conditions-tour_prize-fund_swiper .swiper-button-next',
                prevButton: '.b-conditions-tour_prize-fund_swiper .swiper-button-prev',
                slidesPerView: 3,
                simulateTouch : false,
                mousewheelControl: true,
                observer : true
            });
            var mySwiper2 = new Swiper('.b-conditions-tour_structure_list .swiper-container', {
                direction: 'vertical',
                loop: false,
                nextButton: '.b-conditions-tour_structure_list .swiper-button-next',
                prevButton: '.b-conditions-tour_structure_list .swiper-button-prev',
                slidesPerView: 4,
                simulateTouch : false,
                mousewheelControl: true,
                observer : true
            });
            mySwiper1.update( function(){
                debugger;
            });
            setTimeout(function(){
                mySwiper1.slideTo(0, 0);
                mySwiper2.slideTo(0, 0);
            }, 100);

        }, function errorCallback(response) {
            console.log( response );
        });

    $scope.playBtnDisable = function(){
        $scope.playBtn = false;
    };

    $scope.playBtnEnable = function(){
        $scope.playBtn = true;
        console.log('$scope.playBtn: ', $scope.playBtn )
    };

    // WS: Включение кнопки поиска игры
    $scope.$on('APPLICATION_DISAPPLIED', function(){
        $scope.playBtnEnable();
    });

    $scope.$on('MATCH_FINISH', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('APPLICATION_DISAPPLIED', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('APPLICATION_DECLINED', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('MATCH_FINISH', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('APPLICATION_TIMEOUT', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('APPLICATION_ROOM_TIMEOUT', function(){
        $scope.playBtnEnable();
    });
    $scope.$on('APPLICATION_BROKEN', function(){
        $scope.playBtnEnable();
    })

    $scope.$on('actualMatchApp', function(){
        console.log('on actualMatchApp');
        $scope.playBtnDisable();
    });

    //Нажатие на кнопку "ИГРАТЬ"
    $scope.playBtn = true;
    $scope.apply = function() {

        $scope.playBtn = false;
        var currentUrl = $rootScope.rootUrl+ '/api/match/apply';
        localStorage.setItem('currentbit',$scope.price);
        localStorage.setItem('currenttourId',1);
        var data = {
            bid: $scope.price,
            tournament_id:1
        };
        $http.post(currentUrl, data).then(
            function successCallback(response) {
        }, function errorCallback(response) {

            if(response.data.error.type == 'NotPlayingTimeException' ) {
                $rootScope.showNotification('TOURNAMENT_NOTIFICATION__TIME_IS_OVER', 'information');
                $scope.playBtn = true;

            } else if(response.data.error.type == 'AccountBlockException' ) {
                $rootScope.showNotification('TOURNAMENT_NOTIFICATION__ACCOUNT_BLOCKED', 'information');
                $scope.playBtn = true;
            } else if (response.data.error.type == 'NotEnoughCostsException') {
                $rootScope.showNotification('TOURNAMENT_NOTIFICATION__YOU_LOOSED', 'information');
                //$rootScope.modalAlertText('md', 'Нехватает Starpoints для участия');
            } else {
                $rootScope.showNotification('TOURNAMENT_NOTIFICATION__ERROR', 'information');
                $scope.playBtn = true;
            }

        });
    };

    // Список участников турнира
    $scope.tournListUsersLimit = 3;
    $scope.tourLadderUrl= 'api/tournament/'+ $scope.params.id + '/ladder';
    $http.get($scope.tourLadderUrl)
        .then(function successCallback(response) {
            $scope.tournListUsers = response.data.data;
        }, function errorCallback(response) {
            console.log( response );
        });

    // Информация по текущему пользователю
    $scope.tourLadderUrlMe = 'api/tournament/'+ $scope.params.id + '/me';
    $http.get($scope.tourLadderUrlMe)
        .then(function successCallback(response) {
            $scope.tournCurrentUser = response.data.data;
            //$scope.tournCurrentUser.status = 'NONE';
        }, function errorCallback(response) {
            console.log( response );
        });
});
