(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .component('gsRankImg', {
            controller: Controller,
            template: ['$element', '$attrs', template],
            bindings: {
                rank: '<'
            }
        });

    Controller.$inject = ['$window'];

    /* @ngInject */
    /**
     * @property {string} rank
     * @param {angular.IWindowService} $window
     * @constructor
     */
    function Controller($window) {
        var ctrl = this;

        ctrl.onClick = onClick;

        ctrl.title = 'RANK__TITLE_' + ctrl.rank;
        ctrl.text = 'RANK__TEXT_' + ctrl.rank;

        function onClick() {
            $window.open('http://news.gamestars.gg/index.php?threads/gamestars-rating-system-shiny-new-badges-for-all.14/');
        }
    }

    /**
     * @param {angular.IAugmentedJQuery} $element
     * @param {angular.IAttributes} $attrs
     * @returns {string}
     */
    function template($element, $attrs) {
        var appendToBody = !angular.isUndefined($attrs['appendToBody']);
        
        return '<img style="cursor: pointer" ' +
                    'ng-if="$ctrl.rank" ' +
                    'ng-src="/src/img/ranking/emblem-{{::$ctrl.rank}}.png" ' +
                    'ng-click="$ctrl.onClick()" ' +
                    'uib-popover="{{$ctrl.text | translate}}" ' +
                    'popover-title="{{$ctrl.title | translate}}" ' +
                    'popover-trigger="mouseenter" ' +
                    'popover-placement="right" ' +
                    'popover-append-to-body="'+ (appendToBody ? 'true' : 'false') +'" />';
    }

})();