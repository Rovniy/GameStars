(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('PromoCodeModalController', PromoCodeModalController);

    PromoCodeModalController.$inject = ['$uibModalInstance', 'userProfileService'];

    /* @ngInject */
    /**
     * Контроллер модального окна ввода промо-кода
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function PromoCodeModalController($uibModalInstance, userProfileService) {
        var vm = this;

        vm.loading = false;
        vm.code = '';
        vm.error = undefined;
        
        vm.submit = submit;

        ////////////////

        function submit() {
            vm.loading = true;
            vm.error = undefined;

            userProfileService
                .submitPromoCode(vm.code)
                .then(function () {
                    $uibModalInstance.close();
                })
                .catch(function (errorType) {
                    switch (errorType) {
                        case 'PromoCodeAlreadyUsedException':
                            vm.error = 'LK__MODAL_PROMO_ERROR_USED';
                            break;

                        case 'NotFoundPromoCodeException':
                            vm.error = 'LK__MODAL_PROMO_ERROR_NOT_FOUND';
                            break;

                        default:
                            vm.error = 'LK__MODAL_PROMO_ERROR_DEFAULT';
                            break;
                    }
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
    }

})();