(function (angular, $) {
    'use strict';

    angular
        .module('notyModule', [])
        .provider('noty', notyProvider);

    function notyProvider() {
        var settings  = $.noty.defaults;

        return {
            settings: settings,
            $get: function () {
                var icon;
                var callNoty = function (newSettings) {
                    return noty(newSettings || {});
                };

                return {
                    show: function (message, type) {
                        //1) Error - критическая ошибка на сервере
                        //2) Success - уваедомление пользователя о любом событии, которое он сделал
                        //3) Information - уведомление о событии, которое произошло с его ставкой
                        //4) Cofirm - Общие уведомления от сервиса gamestars
                        if (type == 'success') icon = "fa-thumbs-up";
                        if (type == 'error') icon = "fa-exclamation-circle";
                        if (type == 'information') icon = "fa-exclamation-triangle";
                        if (type == 'cofirm') icon = "fa-star";
                        //message
                        callNoty({
                            theme: 'relax',
                            text: message,
                            type: type,
                            layout: 'topLeft',
                            dismissQueue: true,
                            timeout: 10000,
                            maxVisible: 5,
                            template: '<div class="noty_message"><span class="noty_text"></span></div><div class="noty_icons"><i class="fa ' + icon + '"></i></div>',
                            closeWith: ['click'],
                            animation: {
                                open: 'animated bounceInLeft',
                                close: 'animated bounceOutLeft',
                                easing: 'swing',
                                speed: 500
                            }
                        });
                    },
                    closeAll: function () {
                        return $.noty.closeAll()
                    },
                    clearShowQueue: function () {
                        return $.noty.clearQueue();
                    }.bind(this)
                }
            }

        };
    }
}(angular, jQuery));