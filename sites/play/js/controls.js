// App
var gamestar = angular.module('gamestar', ['ngAnimate', 'ui.bootstrap']);

gamestar.filter('i18n', function($rootScope) {

    return function(label) {

        if (!label) return '';
        return ($rootScope.dict[label]||'i18n fail: ' + label)+'';
    };
});

// All Page
gamestar.controller('allPage', function ($scope, $rootScope, $uibModal) {

    //Получение ID из Гугла
    ga(function(tracker) {
        $rootScope.clientId = tracker.get('clientId'); // get client id from tracker
        console.log('GOOGLE ID',$rootScope.clientId);
        document.cookie = "_ga_cid=" + $scope.clientId + "; path=."; // save it to cookie _ga_cid
    });
    $rootScope.i18n = window.i18n;
    $rootScope.dict = $rootScope.i18n[$rootScope.currentLanguage]||$rootScope.i18n['EN'];

    // Регулярка проверки email
    $scope.EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Проверка на реф ссылку
    if( window.location.search.match(/[?&]ref=/) ){
        var refLinkId = window.location.search.replace(/[?&]ref=/, ' ');
        document.cookie = "refLinkId="+refLinkId;
        //Редирект http://play.game-stars.ru/
        document.location = window.location.protocol+'//' + window.location.host;
    }
    // Modal
    // main params
    $scope.items = 1;
    $scope.modal = function (size, path) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/js/modal/' + path,
            controller: 'ModalCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        });
    };

    $rootScope.gaOpenRegistration = function() {
        ga('send', 'event', 'registration', 'popup_show', '');
    }

});
// Контроллер отрендеренного окна
gamestar.controller('ModalCtrl', function ($scope, $uibModalInstance, items, $http) {
    $scope.EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.modalContentStatus = false;
    $scope.checkSignup = false;
    $scope.checkLogin = false;
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function readCookie(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    $scope.refLinkID = readCookie('refLinkId');

    // Sign up
    $scope.signupBtnDisable = false;
    $scope.signup = function(){
        $scope.signupBtnDisable = true;

        var data =  {
            "email": $scope.signupEmail,
            "name": $scope.signupLogin,
            "password": $scope.signupPass,
            "acceptConditions": "true",
            "additionalIds": [
                { "name" : "clientId", "value" :  $cookies.get('_ga_cid')}
            ],
            "tz": new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]
        };
        $http.post('/api/signup', angular.toJson(data)  )
            .then(function successCallback(response) {
                ga('send', 'event', 'registration', 'submit', '');
                console.log('success');
                $scope.modalSendComplate = true;
            }, function errorCallback(response) {
                $scope.signupBtnDisable = false;
                $scope.modalSendError = true;
            })
        ;
    };

    // Login
    $scope.loginBtnDisable = false;
    $scope.login = function(){
        $scope.loginBtnDisable = true;
        var data =  {
            "email": $scope.loginEmail,
            "password": $scope.loginPass
        };
        $http.post('/api/login', angular.toJson(data)  )
            .then(function successCallback(response) {
                console.log('controls login success');
                $scope.modalSendComplate = true;
                //document.location = 'http://game-stars.ru';
                document.location = window.location.protocol + '//' + window.location.host.replace(/^[^.]+\./g,'');
            }, function errorCallback(response) {
                console.log('controls login error');

                $scope.loginBtnDisable = false;
                $scope.modalSendError = response.data.type;
            })
        ;
    };

});



// jQuery
$(document).ready(function ($) {

    //��������� �������� �������


    var remain_bv;
    $.getJSON('/api/tournament/3/countdown', function(my) {
        console.log('my: ', my);
        remain_bv = my.data.countdown;

        // $.getJSON('/tournament/1/countdown', function(datas) {
        // if (datas.status == '1') {
        // remain_bv = datas.data.countdown;
        // } else if (datas.status == '0') {
        // console.log(datas.error.code);
        // console.log(datas.error.type);
        // }
        //console.log(remain_bv);
        //��� ������ ���� ����� �����������
        function parseTime_bv(timestamp){
            if (timestamp < 0) timestamp = 0;

            var day = Math.floor(timestamp/60/60/24);
            var hour = Math.floor((timestamp/60/60)%24);
            var mins = Math.floor((timestamp / 60 ) % 60);
            var secs = Math.floor(timestamp - day*24*60*60 - hour*60*60 - mins*60);

            if(String(day).length > 1)
                $('.afss_day_bv').text(day);
            else
                $('.afss_day_bv').text("0" + day);

            if(String(hour).length > 1)
                $('.afss_hours_bv').text(hour);
            else
                $('.afss_hours_bv').text("0" + hour);

            if(String(mins).length > 1)
                $('.afss_mins_bv').text(mins);
            else
                $('.afss_mins_bv').text("0" + mins);

            if(String(secs).length > 1)
                $('.afss_secs_bv').text(secs);
            else
                $('.afss_secs_bv').text("0" + secs);

        }


        setInterval(function(){
            remain_bv = remain_bv - 1;
            parseTime_bv(remain_bv);
            if(remain_bv <= 0){
            }
        }, 1000);

        //����������� ��������� � �������
        $('.ccolor3').mouseenter(function() {
            $('#desccrcl1').fadeIn();
        });
        $('.ccolor3').mouseleave (function(){
            $('#desccrcl1').fadeOut();
        });

        $('.ccolor1').mouseenter(function() {
            $('#desccrcl4').fadeIn();
        });
        $('.ccolor1').mouseleave (function(){
            $('#desccrcl4').fadeOut();
        });

        $('.ccolor4').mouseenter(function() {
            $('#desccrcl2').fadeIn();
        });
        $('.ccolor4').mouseleave (function(){
            $('#desccrcl2').fadeOut();
        });

        $('.ccolor2').mouseenter(function() {
            $('#desccrcl5').fadeIn();
        });
        $('.ccolor2').mouseleave (function(){
            $('#desccrcl5').fadeOut();
        });

        $('.ccolor5').mouseenter(function() {
            $('#desccrcl3').fadeIn();
        });
        $('.ccolor5').mouseleave (function(){
            $('#desccrcl3').fadeOut();
        });



        //������� ������� �� ?���?�
        $("a.ancLinks").click(function () {
            var elementClick = $(this).attr("href");
            var destination = $(elementClick).offset().top;
            $('html,body').animate( { scrollTop: destination }, 500 );
            return false;
        });



        $('#lifirst').onScreen({
            container: window,
            direction: 'vertical',
            doIn: function() {
                $('#img1').css('right','150px');
                $('#text1').css('left','0');
            },
            doOut: function() {
                $('#img1').css('right','5000');
                $('#text1').css('left','5000');
            },
            tolerance: 0,
            throttle: 50,
            debug: false
        });

        $('#lisecond').onScreen({
            container: window,
            direction: 'vertical',
            doIn: function() {
                $('#img2').css('left','50px');
                $('#text2').css('right','0');
            },
            doOut: function() {
                $('#img2').css('left','5000');
                $('#text2').css('right','5000');
            },
            tolerance: 0,
            throttle: 50,
            debug: false
        });

        $('#lithird').onScreen({
            container: window,
            direction: 'vertical',
            doIn: function() {
                $('#img3').css('right','80px');
                $('#text3').css('left','0');
            },
            doOut: function() {
                $('#img3').css('right','5000');
                $('#text3').css('left','5000');
            },
            tolerance: 0,
            throttle: 50,
            debug: false
        });
        //Chrome Smooth Scroll
        try {
            $.browserSelector();
            if($("html").hasClass("chrome")) {
                $.smoothScroll();
            }
        } catch(err) {

        }

        $('.carousel').carousel({
        interval: 9000,
        pause: 'hover'
        })


    });

});