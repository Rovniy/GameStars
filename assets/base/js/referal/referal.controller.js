(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('ReferalController', ReferalController);

    ReferalController.$inject = ['$scope', '$route', 'modalService', 'referalService', 'notificationService'];

    /* @ngInject */
    /**
     * @param {angular.IScope} $scope
     * @param {angular.route.IRouteService} $route
     * @param {modalService} modalService
     * @param {referalService} referalService
     * @param {notificationService} notificationService
     * @constructor
     */
    function ReferalController($scope, $route, modalService, referalService, notificationService) {
        var vm = this;
        var clipboard = null;

        // Спокировать реферальную ссылку
        vm.btnGetReferal = false;
        /** @type {ReferralData} */
        vm.refResult = undefined;
        vm.loading = false;
        vm.showReferalLink = false;

        vm.openReferalModal = openReferalModal;
        vm.getReferalBonus = getReferalBonus;
        vm.shareLinkToNetwork = shareLinkToNetwork;

        activate();

        ////////////////

        function activate() {
            // Получаем с бэка реферальную ссылку
            return referalService
                .getReferalLink()
                .then(function (refResult) {
                    vm.btnGetReferal = true;
                    vm.refResult = refResult;

                    initClipboard();
                })
                .catch(function () {
                    vm.btnGetReferal = false;
                });
        }

        function initClipboard() {
            clipboard = new Clipboard('#copyReferal', {
                text: function() {
                    return vm.refResult.referral_url;
                }
            });

            clipboard.on('success', function() {
                notificationService.success('REFERAL__LINK_COPIED');
            });

            clipboard.on('error', openReferalModal);

            $scope.$on('$destroy', function () {
                clipboard.destroy();
            });
        }

        function openReferalModal(){
            if (!vm.btnGetReferal){
                return;
            }

            modalService.openModal('copy-referal.html', { size: 'sm' }, { referral_url: vm.refResult.referral_url });
        }

        // Забрать полученные бонусы с реферальных друзей
        function getReferalBonus() {
            vm.loading = true;

            referalService
                .getReferalBonus()
                .then(function () {
                    notificationService.success('REFERAL__BONUS_RECEIVED');
                    $route.reload();
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function shareLinkToNetwork() {
            //console.log('ererwe');
            FB.ui({
                method: 'share',
                mobile_iframe: true,
                href: vm.refResult.referral_url,
                //redirect_uri:vm.refResult.referral_url
            }, function(response){});
        }
    }

})();