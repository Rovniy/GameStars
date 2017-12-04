(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .component('gsSlider', {
            templateUrl: '/src/html/templates/slider.view.html',
            controller: SliderController,
            bindings: {
                min: '<', // минимальная ставка
                max: '<', // максимальная ставка
                step: '<', // шаг ставки
                onUpdate: '&' // callback функция при изменении значения слайдера
            }
        });

    SliderController.$inject = [];

    /* @ngInject */
    /**
     * @property {number} min
     * @property {number} max
     * @property {number} step
     * @property {function} onUpdate
     * @constructor
     */
    function SliderController() {
        var ctrl = this;
        var $slider = undefined;

        ctrl.$onInit = $onInit;
        ctrl.$onDestroy = $onDestroy;

        function $onInit() {
            // slider UI
            $slider = $('#defSli')
                .slider({
                    min: ctrl.min,
                    max: ctrl.max,
                    step: ctrl.step,
                    range: 'min',
                    create: function (event, ui) {
                        $('.ui-slider-handle').append('<span>' + ctrl.min + '</span>');
                    },
                    slide: function (event, ui) {
                        ctrl.onUpdate({value: ui.value});
                        $(ui.handle).children('span').text(ui.value);
                    }
                })
                .slider("pips", {
                    rest: "label"
                });
        }

        function $onDestroy() {
            $slider && $slider.slider("destroy");
        }
    }

})();