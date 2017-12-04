(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkShopController', LkShopController);

    LkShopController.$inject = ['Analytics', 'modalService', 'paymentService', 'userProfileService'];

    /* @ngInject */
    /**
     * @param {Analytics} Analytics
     * @param {modalService} modalService
     * @param {paymentService} paymentService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function LkShopController(Analytics, modalService, paymentService, userProfileService) {
        var vm = this;

        vm.shopItems = paymentService.getShopItems();

        vm.openBuyModal = openBuyModal;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('lk_page', 'starpoints', '', {});
        }
        
        function openBuyModal(starpoints) {
            var options = { controller: 'BuyStarpointsModalController' };
            var data = { sp: starpoints };
            var instance = modalService.openModal('buy-starpoints.html', options, data);
            
            instance.result.then(userProfileService.reloadUserProfile);
        }
    }

})();