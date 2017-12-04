(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('RulesController', RulesController);

    RulesController.$inject = ['$rootScope', '$scope', 'rulesService'];

    /* @ngInject */
    /**
     * @param {angular.IRootScopeService} $rootScope
     * @param {angular.IScope} $scope
     * @param {rulesService} rulesService
     * @constructor
     */
    function RulesController($rootScope, $scope, rulesService) {
        var vm = this;

        // vm.agreement = undefined;

        activate();

        ////////////////

        function activate() {
            var unsubscribe = $rootScope.$on('$translateChangeSuccess', function (event, data) {
                loadText(data.language);
            });
            
            $scope.$on('$destroy', function () {
                unsubscribe();
            });

            return loadText()
        }

        function loadText(lang) {
            return rulesService
                .getAgreement(lang)
                .then(function(agreement){
                    // vm.agreement = agreement;
                    $('#agreement-container').html(agreement);
                });
        }
    }

})();