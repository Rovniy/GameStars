(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkController', LkController);

    LkController.$inject = ['$scope', '$routeParams', '$location', '$route', 'modalService', 'userProfile'];

    /* @ngInject */
    /**
     * 
     * @param $scope
     * @param $routeParams
     * @param {angular.ILocationService} $location
     * @param {angular.route.IRouteService} $route
     * @param {modalService} modalService
     * @param {UserProfile} userProfile
     * @constructor
     */
    function LkController($scope, $routeParams, $location, $route, modalService, userProfile) {
        $scope.params = $routeParams;
        $scope.loggedIn = false;
        
        activate();
        
        ///////////////////////
        
        function activate() {
            if (userProfile){
                $scope.loggedIn = true;

                if ($scope.params.message){
                    modalService.openRawTextModal($scope.params.message);
                }
            }
            else{
                var instance = modalService.openModal('login.html', { controller: 'LoginModalController' });
                instance.result
                    .then(function () {
                        $route.reload();
                    })
                    .catch(function () {
                        $location.url('/');
                    });
            }
        }
    }

})();
