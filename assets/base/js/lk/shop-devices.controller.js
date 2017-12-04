(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkShopDevicesController', LkShopDevicesController);

    LkShopDevicesController.$inject = ['$scope', 'Analytics', 'modalService'];

    /* @ngInject */
    /**
     * 
     * @param $scope
     * @param {Analytics} Analytics
     * @param {modalService} modalService
     * @constructor
     */
    function LkShopDevicesController($scope, Analytics, modalService) {
        $scope.shopItemsDevices = [
            {
                'id': 1,
                'category': 'mouse',
                "title": 'A4Tech Bloody V3M',
                "cost": 75,
                'img': 'img1'
            },
            {
                'id': 2,
                'category': 'mouse',
                "title": 'Gamdias OUREA GMS5500',
                "cost": 90,
                'img': 'img2'
            },
            {
                'id': 3,
                'category': 'headphones',
                "title": 'ASUS Strix 7.1 Headset',
                "cost": 690,
                'img': 'img6'
            },
            {
                'id': 4,
                'category': 'mousepad',
                "title": 'A4Tech Bloody B070',
                "cost": 32,
                'img': 'img3'
            },
            {
                'id': 5,
                'category': 'keyboard',
                "title": 'QCyber Syrin PRO v2',
                "cost": 142,
                'img': 'img4'
            },
            {
                'id': 6,
                'category': 'headphones',
                "title": 'Platronic gamecom 318',
                "cost": 89.5,
                'img': 'img5'
            }
        ];

        $scope.showTemNoty = showTemNoty;
        
        var vm = this;

        activate();

        ////////////////

        function activate() {
            Analytics.trackEvent('shop', 'show', '', {});
        }

        function showTemNoty(row) {

            Analytics.trackEvent('shop', 'try_buy', '', {
                title: row.title,
                price: row.cost,
                category: row.category,
                currency: 'realpoints'
            });

            modalService.openTextModal('UNDER_CONSTRUCTION');
        }
    }

})();