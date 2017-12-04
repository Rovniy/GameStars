(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkPaymentsController', LkPaymentsController);

    LkPaymentsController.$inject = ['paymentService', 'Analytics', 'userProfileService', 'modalService'];

    /* @ngInject */
    /**
     * @param {paymentService} paymentService
     * @param {Analytics} Analytics
     * @param {userProfileService} userProfileService
     * @param {modalService} modalService
     * @constructor
     */
    function LkPaymentsController(paymentService, Analytics, userProfileService, modalService) {
        var vm = this;
        var page = 0;
        var perpage = 50;
        
        vm.loadingTransactions = false;
        vm.loadingBonuses = false;
        vm.myGainValue = undefined;
        vm.transactions = [];
        vm.bonuses = [];

        vm.loadTransactions = loadTransactions;
        vm.getUserRealpointsVip = getUserRealpointsVip;
        vm.getUserRealpointsBonus = getUserRealpointsBonus;
        vm.openPaymentModal = openPaymentModal;
        vm.openWithdrawalModal = openWithdrawalModal;
        vm.isWithdrawalVisible = isWithdrawalVisible;
        vm.loadBonuses = loadBonuses;
        vm.calcProgress = calcProgress;
        vm.isVipStatus = isVipStatus;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('lk_page', 'payments', '', {});

            getGainMoney();
            loadTransactions();
            loadBonuses();
        }

         function loadTransactions() {
             vm.loadingTransactions = true;

             return paymentService
                 .getUserTransactions(page, perpage)
                 .then(function (transactions) {
                     vm.transactions = transactions;
                 })
                 .finally(function(){
                     vm.loadingTransactions = false;
                 });
        }
        
        function loadBonuses() {
            vm.loadingBonuses = true;

            return paymentService
                .getUserBonuses()
                .then(function (bonuses) {
                    vm.bonuses = bonuses;
                })
                .finally(function(){
                    vm.loadingBonuses = false;
                });
        }

        function getGainMoney() {
            return paymentService
                .getGainValue()
                .then(function (value) {
                    vm.myGainValue = value;
                });
        }

        function getUserRealpointsVip(){
            return userProfileService.getUserRealpointsVip();
        }
        
        function getUserRealpointsBonus() {
            return userProfileService.getUserRealpointsBonus();
        }
        
        function openPaymentModal() {
            modalService.openModal('payment.html');
        }

        function openWithdrawalModal() {
            modalService.openModal('withdrawal.html', { controller: 'WithdrawalController' }, { maxWithsrow: vm.myGainValue });
        }

        function isWithdrawalVisible() {
            var userProfile = userProfileService.getUserProfile();
            return userProfile && userProfile.level >= 2;
        }
        
        function calcProgress(surcharge) {
            return Math.round(surcharge.turnover / surcharge.count * 100);
        }
        
        function isVipStatus() {
            return userProfileService.isVipStatus();
        }
    }

})();