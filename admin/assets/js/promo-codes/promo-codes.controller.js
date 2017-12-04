(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('PromoCodesController', PromoCodesController);

    PromoCodesController.$inject = ['$timeout', 'promoCodesService'];

    /* @ngInject */
    /**
     * @param {angular.ITimeoutService} $timeout
     * @param {promoCodesService} promoCodesService
     * @constructor
     */
    function PromoCodesController($timeout, promoCodesService) {
        var vm = this;

        vm.promoCodes = undefined;
        vm.pagination = undefined;
        vm.promoItems = undefined;
        vm.page = 1;
        vm.perPage = 50;
        vm.loading = false;
        vm.error = null;
        vm.newPromoCode = {
            code: '',
            quantity: 1,
            itemId: null,
            useCount: 1,
            expireTime: null
        };

        vm.loadPromoCodes = loadPromoCodes;
        vm.save = save;

        activate();

        ////////////////

        function activate() {
            loadPromoItems();
            loadPromoCodes();
        }
        
        function loadPromoCodes() {
            return promoCodesService
                .getPromoCodes(vm.page - 1, vm.perPage)
                .then(function (promoCodes) {
                    vm.promoCodes = promoCodes.data;
                    vm.pagination = promoCodes.pagination;
                });
        }

        function loadPromoItems() {
            return promoCodesService
                .getPromoItems()
                .then(function (promoItems) {
                    vm.promoItems = promoItems.data;
                });
        }
        
        function save() {
            vm.loading = true;
            vm.success = false;
            vm.error = false;
            
            promoCodesService
                .create(vm.newPromoCode)
                .then(function () {
                    vm.success = true;
                    $timeout(function () {
                        vm.success = false;
                    }, 3000);
                })
                .catch(function (response) {
                    if (response.data && response.data.error){
                        vm.error =  JSON.stringify(response.data.error);
                    }
                    else{
                        vm.error = 'Ошибка при выполнении запроса';
                    }
                })
                .then(loadPromoCodes)
                .finally(function () {
                    vm.loading = false;
                });
        }
    }

})();