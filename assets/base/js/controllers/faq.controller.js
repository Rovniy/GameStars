(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('FaqTabsQuestionsController', FaqTabsQuestionsController);

    FaqTabsQuestionsController.$inject = [];

    /* @ngInject */
    function FaqTabsQuestionsController() {
        var vm = this;

        vm.oneAtATime = true;

        activate();

        ////////////////

        function activate() {

        }
    }

})();