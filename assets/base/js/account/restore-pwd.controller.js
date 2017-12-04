(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('RestorePwdController', RestorePwdController);

    RestorePwdController.$inject = ['$uibModalInstance', 'notificationService', 'userProfileService'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {notificationService} notificationService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function RestorePwdController($uibModalInstance, notificationService, userProfileService) {
        var vm = this;

        vm.loading = false;
        vm.restoreEmail = '';
        
        vm.restorePassword = restorePassword;

        ////////////////

        function restorePassword() {
            vm.loading = true;

            userProfileService
                .restorePassword(vm.restoreEmail)
                .then(function () {
                    notificationService.success('REMINDER__CONFIRM_EMAIL_SENT');
                    $uibModalInstance.close();
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
    }

})();

