(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('ModalDefaultController', ModalDefaultController);

    ModalDefaultController.$inject = ['$uibModalInstance', 'modalData', 'modalService'];

    /* @ngInject */
    /**
     * @param {angular.ui.bootstrap.IModalServiceInstance} $uibModalInstance
     * @param modalData
     * @param {modalService} modalService
     * @constructor
     */
    function ModalDefaultController($uibModalInstance, modalData, modalService) {
        var vm = this;
        
        vm.cancel = cancel;
        vm.close = close;
        vm.openModal = openModal;
        
        activate();

        ////////////////

        function activate() {
            // переносим данные из resolve
            angular.extend(vm, modalData);
        }
        
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function close(result) {
            $uibModalInstance.close(result);
        }

        /**
         *
         * @param {string} templateId
         * @param {string} size
         * @param {*} modalData
         * @returns {*|angular.IPromise.<*>}
         */
        function openModal(templateId, size, modalData) {
            var modalInstance = modalService.openModal(templateId, { size: size }, modalData);

            $uibModalInstance.dismiss(modalInstance);

            return modalInstance;
        }
    }

})();

