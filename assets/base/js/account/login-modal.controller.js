(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LoginModalController', LoginModalController);

    LoginModalController.$inject = ['$uibModalInstance', 'authenticationService', 'modalService'];

    /* @ngInject */
    /**
     * Контроллер модального окна логина
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {authenticationService} authenticationService
     * @param {modalService} modalService
     * @constructor
     */
    function LoginModalController($uibModalInstance, authenticationService, modalService) {
        var vm = this;
        
        vm.loginEmail = '';
        vm.loginPass = '';
        vm.error = undefined;
        vm.status = undefined;
        vm.loading = false;
        
        vm.login = login;
        vm.openPwdRestore = openPwdRestore;
        vm.externalLogin = externalLogin;

        ////////////////

        function login(){
            vm.loading = true;
            
            authenticationService
                .login(vm.loginEmail, vm.loginPass)
                .then(function (response) {
                    // закрытие окна после успешного логина
                    $uibModalInstance.close();
                })
                .catch(function (response) {
                    vm.error = response.data && response.data.type;
                    vm.status = response.status;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function openPwdRestore() {
            modalService.openModal('reminder.html', { controller: 'RestorePwdController' });
            $uibModalInstance.dismiss();
        }
        
        function externalLogin(provider, url) {
            authenticationService.externalLogin(provider, url);
        }
    }

})();