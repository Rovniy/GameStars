var gamestar = angular.module('gamestar', ['ngAnimate', 'angular-loading-bar', 'cfp.loadingBar', 'ui.bootstrap', 'ui.validate', 'notyModule', 'ngRoute', 'ngSanitize', 'ngCookies'])
    .config(function($routeProvider){
        $routeProvider
            .when ('/', {
                templateUrl: 'main.html'
            })
            .when ('/tournaments', {
                templateUrl: '/src/html/tournaments.html',
                controller: 'tournamentsRoute'
            })
            .when ('/tournament/lol/:id', {
                templateUrl: '/tournament-lol.html',
                controller: 'tournaments'
            })
            .when ('/tournament-rules', {
                templateUrl: '/src/html/tournament-rules.html'
            })
            .when ('/news', {
                templateUrl: '/src/html/news.html'
            })
            .when ('/faq', {
                templateUrl: '/src/html/faq.html',
                controller: 'faqTabsQuestions'
            })
            .when ('/referal', {
                templateUrl: '/src/html/referal.html',
                controller: 'referal'
            })
            .when ('/starclient', {
                templateUrl: '/src/html/starclient.html',
                controller: 'getCode'
            })
            .when ('/info', {
                templateUrl: 'info.html'
            })
            .when ('/tournamentTimeBomb', {
                templateUrl: 'tournamentTimeBomb.html'
            })
            .when ('/rules', {
                templateUrl: '/src/html/rules.html'

            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
    }])

// Общий контроллер на все страницы
gamestar.controller('allPage', function ($scope, $http, $rootScope, $uibModal, $window, noty, cfpLoadingBar, $exceptionHandler, http, $cookies, $location, saitConfig, SocketBusFucking) {


    //$rootScope.currentLanguage = 'EN';
    $rootScope.hidePreloader = false; //Дефолтное срытие прелоадера
    $scope.userIsAdmin = true; //Если пользователь админ
    $rootScope.rootUrl = $rootScope.config.currentUrl; //Корневой URL проекта
    $rootScope.ifindthegamenow = false; //Дефолтное скрытие блока поиска игры в шапке сайта

    // Показываем прелоадер при подгрузке контента
    $rootScope.$on('cfpLoadingBar:started', function() {
        $rootScope.hidePreloader = false;
    });
    // Скрываем прелоадер после удачной загрузки контента
    $rootScope.$on('cfpLoadingBar:completed', function() {
        setTimeout(function() {
                $rootScope.hidePreloader = true;
            }
            , 300);
    });

    //Фукнция редиректов
    $rootScope.goto = function(url){
        $location.url(url);
    };

    $rootScope.translate = function(label){
        console.log('translate: ', label);
        return $rootScope.dict[label]||'translate error: '+ label;
    };

    //Перевод и все, что с ним связано
    $rootScope.i18n = window.i18n;
    //var language = window.navigator.userLanguage || window.navigator.language;
    var language = 'EN';
    var lang;
    try {
        lang = $cookies.get('lang');
        //lang= location.search.match(/lang=([A-Z]*)/)[1];
    } catch (err){
    }
    $rootScope.currentLanguage = lang||language.slice(0,2).toUpperCase(); //works IE/SAFARI/CHROME/FF
    console.log('$rootScope.currentLanguage: ', $rootScope.currentLanguage);
    $rootScope.dict = $rootScope.i18n[$rootScope.currentLanguage]||$rootScope.i18n['EN'];
    $rootScope.setLang = function(lang){
        //$rootScope.$apply(function(){
        setTimeout(function () {
            $rootScope.$apply(function() {
                $rootScope.currentLanguage = lang;
                console.log('$rootScope.currentLanguage: ', $rootScope.currentLanguage);

                location.reload()
                $rootScope.dict = $rootScope.i18n[$rootScope.currentLanguage]||$rootScope.i18n['EN'];
                console.log('$rootScope.dict : ', $rootScope.dict );
                //$window.location.reload();
                $cookies.put('lang', lang);
                //window.location.href = window.location.pathname + location.hash;
            });
        }, 100);
    };
    $rootScope.CONTENT= window.i18n[$rootScope.currentLanguage];
    console.log('$rootScope.CONTENT: ', $rootScope.CONTENT);

    //Скрытие и отображение блока поиска игры
    $rootScope.searchWindowStart = function() {
        $rootScope.ifindthegamenow = true;
    }
    $rootScope.searchWindowClose = function() {
        $rootScope.ifindthegamenow = false;
    }


    // Уведомления браузера. работает 100% в Chrome 27, Firefox 22, Safari 6
    $rootScope.browserNoty = function(text) {
        Notification.requestPermission( newMessage );
        function newMessage(permission) {
            if( permission != "granted" ) return false;
            var gs_BrowserNoty = new Notification("GameStars Team", {
                lang: 'ru-RU',
                tag : "gs_info",
                body : text,
                icon : "./img/gsBrowserNoty.png"
            });
            gs_BrowserNoty.onerror = function(){
                Notification.requestPermission( newMessage );
            };
        }
    };

    // какой-то хендлер, его надо грохнуть
    $rootScope.httpHandler = function(res){
        console.log('http res: ', res);
    };

    // Скрытие и показ окна с аватарками
    $scope.showAvatars = function(){
        $('#changeavatar').show();
    };
    $('body').on('click', function (event) {
        if (event.target.parentElement.parentElement.parentElement.id != "changeavatar" && event.target.parentElement.id != "changeavatar" && event.target.parentElement.parentElement.id != "changeavatar" && event.target.id != 'mainavatarchange' ) {
            $('#changeavatar').hide();
        }
    });

    // Контроллер смены аватарок
    $scope.selectavatar  = function($event) {
        $scope.currentAvatarUrl = $event.currentTarget.dataset.id;
        $scope.currentAvatarId = "/src/img/avatars/" + $event.currentTarget.dataset.id + ".jpg";
        var url = '/api/icon/' +  $scope.currentAvatarUrl;
        http.get(url, $scope.currentAvatarId);
        console.log($scope.currentAvatarId);
        window.sessionStorage.setItem('authStatus', null);
    };

    // Конвертация из секунд в дату
    $scope.toDateTime = function(seconds){
        var t = new Date(1970,0,1);
        t.setSeconds(seconds);
        return t;
    };

    // читаем куки
    function readCookie(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    // Функция открытия окна матча при перезагрузки
    $rootScope.openAgainMatchWindow = function(backdrop) {
        $scope.items = 1;
        $rootScope.modal = function (size, path) {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl:  path,
                size: size,
                backdrop: backdrop,
                backdropClass: 'fadeMatchModalOpen',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
            });
        };
        $scope.$mygameready = true;
        if ($scope.$mygameready == true) {
            $scope.modal('match', 'match.html', 'my');
        }
    };

    $scope.authStatus = window.sessionStorage.getItem('authStatus'); //Получения текущего статуса пользователя
    $rootScope.userProfie = null;//todo remove???
    // Запрос данных профиля

    //$rootScope.safeApply = function(fn) {
    //    var phase = this.$root.$$phase;
    //    if(phase == '$apply' || phase == '$digest') {
    //        if(fn && (typeof(fn) === 'function')) {
    //            fn();
    //        }
    //    } else {
    //        this.$apply(fn);
    //    }
    //};

    $rootScope.getUserProfile = function(){
        http.get('/api/profile').then(function(response) {
            $rootScope.userProfie = response.data.data;
            SocketBus.wsConnect();
            $('#waitWs').fadeOut('slow'); //Скрытие прелоадера
            $scope.currentAvatarId = "/src/img/avatars/" + $rootScope.userProfie.userData.avatarId + ".jpg";
            try {
                var match = $scope.userProfie.options.actualMatchApplications[0];
                if (match)$rootScope.$broadcast('actualMatchApp',  match);
                if ($rootScope.userProfie.userData.role == "ADMIN") $scope.userIsAdmin = true;
                $scope.userProfie.options.actualMatches.forEach(function(a) { //Текущий статус матча, в котором участвует пользователь
                    if (a!==null) {
                        if (a.status == 'CREATED') {
                            $rootScope.openAgainMatchWindow('static');
                        }
                        if (a.status == 'STARTED') {
                            $rootScope.openAgainMatchWindow('static');
                        }
                        if (a.status == 'FINISHED') {
                            $rootSscope.openAgainMatchWindow(true);
                        }
                        if (a.status == 'MATCH_RESULTS_RECEIVED') {
                            $rootScope.openAgainMatchWindow(true);
                        }
                    }
                });
                $scope.userProfie.options.actualMatchApplications.forEach(function(f) { //Текущий статус поиска матча
                    if (f!==null) {
                        if (f.status == 'PREPARE') {
                            $rootScope.searchWindowStart();
                        }
                        if (f.status == 'MATCHED') {
                            $scope.items = 1;
                            $rootScope.modal = function (size, path) {
                                console.log('modal: ', path);
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '/src/html/modal/' + path,
                                    size: size,
                                    backdrop: 'static',
                                    resolve: {
                                        items: function () {
                                            return $scope.items;
                                        }
                                    }
                                });
                                $rootScope.modalInstance.result.then(function (selectedItem) {
                                    $rootScope.selected = selectedItem;
                                });
                            };
                            $scope.$mygameready = true;
                            if ($scope.$mygameready == true) {
                                $scope.modal('sm', 'acceptwindow.html');
                            }
                        }
                        if (f.status == 'ACCEPTED') {
                            $rootScope.beforePressAccept = true;
                            $scope.items = 1;
                            $rootScope.modal = function (size, path) {
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '/src/html/modal/' + path,
                                    size: size,
                                    backdrop: 'static',
                                    resolve: {
                                        items: function () {
                                            return $scope.items;
                                        }
                                    }
                                });
                                $rootScope.modalInstance.result.then(function (selectedItem) {
                                    $rootScope.selected = selectedItem;
                                });
                            };
                            $scope.$mygameready = true;
                            if ($scope.$mygameready == true) {
                                $scope.modal('sm', 'acceptwindow.html');
                            }
                        }
                        if (f.id) {
                            $rootScope.application_id = f.id;
                        }
                    }
                });

            } catch (err){
                console.error('parse data from server: ', err)
            }

            window.sessionStorage.setItem('authStatus', angular.toJson($scope.userProfie) ); // Записываем в Session Storage данные юзера

            // Идентификация в CarrotQuest
            $scope.hash = CryptoJS.HmacSHA256($scope.userProfie.userData.id, 'userauthkey-2465-73084bff47f5c153e7327ab23ed81cbed2df12f561e3855f59a97833335fe6b').toString(); //Генерирования Hmac SHA256 ключа авторизации пользователя
            carrotquest.auth( $scope.userProfie.userData.id, $scope.hash); //Посылаем ключ авторизации
            carrotquest.identify({
                '$name': $scope.userProfie.userData.name, //Имя
                '$email': $scope.userProfie.userData.email, //почта
                'Starpoints': $scope.userProfie.userData.starPoints, //Количество Starpoints
                'Status': $scope.userProfie.userData.active, //Статус пользователя - True, Banned
                'Experience': $scope.userProfie.userData.experience, //Текущий опыт пользователя
                'Stack': $scope.userProfie.stack, //количетсво фишек на руках
                'Level': $scope.userProfie.level //Уровень акканта на GameStars
            });
        }, function errorCallback(response) {
            $('#waitWs').fadeOut('slow');
            // Если человек пришёл по реферальной ссылке
            if( window.location.search.match(/[?&]ref=/) ){
                var refLinkId = window.location.search.replace(/[?&]ref=/, '');
                document.cookie = "refLinkId="+refLinkId;
             }else{
            }
        });

    };

    $rootScope.getUserProfile(); //Запрос данных пользователя

    // Logout пользователя с сайта
    $scope.logout = function(){
        console.log('logout');
        http.get('/api/logout')
            .then(function (response) {
                $rootScope.userProfie = null;
                window.sessionStorage.setItem('authStatus', null);
                window.location.href = '#/';
                $rootScope.getUserProfile()
            }, function (response) {
                window.sessionStorage.setItem('authStatus', null);
                //window.location.href = window.location.protocol + '//'+window.location.host.replace('www.','');
            })
        ;
    };

    // Получение списка серверов
    http.get('/api/lol/regions').then(function (response) {
        if (response.data.data[0]) {
            $rootScope.regionName = response.data.data[0];
        } else {
            console.log('Данные о регионах пусты');
        }
        }, function (response) {
           console.error('error get Region Name', response );
        });

    // ws: если собралась комната
    $scope.$on('APPLICATION_MATCHED', function(e, data){
        document.getElementById('MusicReady').play();
        //Окно подтверждения игры
        $rootScope.room_id = data.room_id;
        $rootScope.searchWindowClose();
         //Вызов окна подтверждения игры
        $scope.items = 1;
        $rootScope.modal = function (size, path) {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/src/html/modal/' + path,
                size: size,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
            });
        };
        $scope.$mygameready = true;
        if ($scope.$mygameready == true) {
            $scope.modal('sm', 'acceptwindow.html');
        }

    });

    // WS: Если команды сформированны
    $scope.$on('MATCH_CREATED', function(e, data){
        $rootScope.status = 'CREATED';
        localStorage.setItem('roomId', data.match_id);
        $rootScope.searchWindowClose();
        if ($rootScope.modalInstance) {
            $rootScope.modalInstance.close($rootScope.selected);
        }
        $scope.items = 1;
        $rootScope.modal = function (size, path) {
           $rootScope.modalInstance = $uibModal.open({
               animation: true,
                templateUrl: path,
                size: size,
                backdrop: 'static',
                backdropClass: 'fadeMatchModalOpen',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
            });
        };
        $scope.$mygameready = true;
        if ($scope.$mygameready == true) {
            $scope.modal('match', 'match.html', 'my');

        }
    });

    // WS: Если вышло время ожидания подбора, то скрываем окно
    $scope.$on('APPLICATION_TIMEOUT', function(e, data){
        $rootScope.searchWindowClose();
        $rootScope.showNotification('APP_NOTIFICATION__SEARCH_FAIL', 'information' );

    });

    // WS: Если вышло время ожидания подбора, то скрываем модальное окно
    $scope.$on('APPLICATION_ROOM_TIMEOUT', function(e, data){
        $rootScope.showNotification('APP_NOTIFICATION__CONFIRM_FAIL', 'information' );
        $rootScope.modalInstance.close($rootScope.selected);
        $rootScope.modal = function (size, path) {
            $rootScope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/src/html/modal/' + path,
                size: size,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            $rootScope.modalInstance.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
            });
        };
        $scope.$mygameready = true;
        if ($scope.$mygameready == true) {
            $scope.modal('sm', 'reaccept.html');
        }
    });

    // WS: Если пришел BROKEN и из за тебя всех выкинуло
    $scope.$on('APPLICATION_BROKEN', function(e, data){
        //$rootScope.modalInstance.close($rootScope.selected);
        $rootScope.showNotification('APP_NOTIFICATION__YOUR_CONFIRM_FAIL', 'information' );
        $rootScope.modalInstance.close($rootScope.selected);
    });

    // WS: если пришел COMPLITE матча
    $scope.$on('MATCH_RESULTS_RECEIVED', function(e, data){
        if ($rootScope.modalInstance) {
            $rootScope.modalInstance.close($rootScope.selected);
        }
        $rootScope.status = 'COMPLITED';
        localStorage.setItem('roomId', data.match_id);
        $rootScope.openAgainMatchWindow(true);
    });

    // WS: если матч окончился
    $scope.$on('MATCH_FINISH', function(e, data){
        if ($rootScope.modalInstance) {
            $rootScope.modalInstance.close($rootScope.selected);
        }
        $rootScope.status = 'FINISHED';
        localStorage.setItem('roomId', data.match_id);
        $rootScope.openAgainMatchWindow(true);
    });

    // Уведомления NOTY о всех событиях на сайте
    $rootScope.showNotification = function (text, type) {
        text = window.i18n[$rootScope.currentLanguage][text]||text;
        noty.show(text, type);
        $rootScope.browserNoty(text);
    };
    // Закрытие уведомлений
    $rootScope.close = function () {
        noty.closeAll()
    }
});


//Получение правил турнира на странице /rules.html
gamestar.controller('GetRules', function ($scope, $http, http, $rootScope) {
    http.get('/api/agreement')
        .then(function successCallback(fulltext) {
            $('#rulesdiv').html(fulltext.data.data.agreement.text)
        }, function errorCallback(fulltext) {
            $scope.Agreements = window.i18n[$rootScope.currentLanguage]['APP_NOTIFICATION__SERVER_ERROR'];
        });
});

$(document).ready(function ($) {
    //ѕлавный переход по якорям
    $("a.ancLinks").click(function () {
        var elementClick = $(this).attr("href");
        var destination = $(elementClick).offset().top;
        $('html,body').animate( { scrollTop: destination }, 500 );
        return false;
    });
});
