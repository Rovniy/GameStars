/**
 * @namespace Admin
 */
(function () {
    'use strict';

    angular
        .module('gsadmin')
        .service('modalService', modalService);

    modalService.$inject = ['$uibModal'];

    /* @ngInject */
    /**
     * Сервис для открытия модальных окон
     * @class
     * @memberOf Admin
     * @param {angular.ui.bootstrap.IModalService} $uibModal
     */
    function modalService($uibModal) {

        this.openModal = openModal;

        ////////////////

        /**
         * @param {string} templateId
         * @param {Object} [options]
         * @param {string} [options.size = 'md']
         * @param {string} [options.controller = 'ModalDefaultController']
         * @param {(string|boolean)} [options.backdrop = true]
         * @param {string} [options.backdropClass]
         * @param {string} [options.windowClass]
         * @param {*} [modalData] - данные для передачи в модальное окно
         * @returns {angular.ui.bootstrap.IModalServiceInstance}
         */
        function openModal(templateId, options, modalData) {
            options = options || {};
            var baseUrl = 'html/modal/';
            var modalInstance = $uibModal.open({
                templateUrl: baseUrl + templateId,
                size: options.size || 'md',
                backdrop: angular.isUndefined(options.backdrop) ? true : options.backdrop ,
                backdropClass: options.backdropClass,
                windowClass: options.windowClass,
                controller: options.controller || 'ModalDefaultController',
                controllerAs: 'modal',
                resolve: {
                    modalData: function () {
                        return modalData;
                    }
                }
            });

            return modalInstance;
        }
    }

})();