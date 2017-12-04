(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('modalService', modalService);

    modalService.$inject = ['$rootScope', '$uibModal', '$q', 'intercomService'];

    /* @ngInject */
    /**
     * Сервис для открытия модальных окон
     * @param {angular.IRootScopeService} $rootScope
     * @param {angular.ui.bootstrap.IModalService} $uibModal
     * @param {angular.IQService} $q
     * @param {intercomService} intercomService
     */
    function modalService($rootScope, $uibModal, $q, intercomService) {
        var buffQueue = $q.resolve();
        /** @type {angular.ui.bootstrap.IModalServiceInstance} */
        var buffModalInstance;

        this.openTextModal = openTextModal;
        this.openRawTextModal = openRawTextModal;
        this.openModal = openModal;
        this.openBuffModal = openBuffModal;
        this.openBalanceErrorModal = openBalanceErrorModal;

        activate();

        ////////////////

        function activate() {
            intercomService.on('modalService.buffModalClosed', function () {
                buffModalInstance && buffModalInstance.dismiss();
            });
        }

        /**
         * Открытие модального окна с текстом
         * @param {string} translationId - id строки из файла локализации locale-*.json
         * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
         * @returns {angular.ui.bootstrap.IModalServiceInstance}
         */
        function openTextModal(translationId, size) {
            var scope = $rootScope.$new(true);
            scope.translationId = translationId;
            size = size || 'md';
            
            var modalInstance = $uibModal.open({
                size: size,
                template:
                    '<div class="modal-header">' +
                        '<h3 class="modal-title">{{\'PUBLIC__ATTENTION\' | translate}}</h3>'+
                        '<i class="genericon genericon-close modal-close" ng-click="$dismiss()"></i>'+
                    '</div>' +
                    '<div class="modal-body ta-center">{{\'' + translationId + '\' | translate}}</div>',
                scope: scope
            });

            return modalInstance;
        }

        /**
         * Открытие модального окна с текстом
         * @param {string} text
         * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
         * @returns {angular.ui.bootstrap.IModalServiceInstance}
         */
        function openRawTextModal(text, size) {
            var scope = $rootScope.$new(true);
            scope.text = text;
            size = size || 'md';

            var modalInstance = $uibModal.open({
                size: size,
                template:
                '<div class="modal-header">' +
                    '<h3 class="modal-title">{{\'PUBLIC__ATTENTION\' | translate}}</h3>'+
                    '<i class="genericon genericon-close modal-close" ng-click="$dismiss()"></i>'+
                '</div>' +
                '<div class="modal-body ta-center" ng-bind="::text"></div>',
                scope: scope
            });

            return modalInstance;
        }

        /**
         * @param {string} templateId
         * @param {Object} [options]
         * @param {boolean} [options.absolutePath = false] - если true, используется абсолютный путь, вместо '/src/html/modal/' + templateId
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
            var baseUrl = options.absolutePath ? '/' : '/src/html/modal/';
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
                        return modalData || {};
                    }
                }
            });

            return modalInstance;
        }


        /**
         * @param {string} buffId
         * @param {object} data
         * @param {boolean} activate - баф был активирован
         * @return {angular.IPromise<angular.ui.bootstrap.IModalServiceInstance>}
         */
        function openBuffModal(buffId, data, activate) {
            var templateId;
            var scope = $rootScope.$new(true);

            scope.data = data;
            scope.buffId = buffId;

            if (activate){
                scope.buffId += '_ACTIVATE';
            }
            
            switch (buffId){
                case 'STAR_POINTS':
                case 'REAL_POINTS':
                case 'REAL_POINTS_BONUS':
                    templateId = '3'; //Vayne
                    break;

                case '2X_WIN':
                case '2X_PAYING':
                    templateId = '2'; //Twisted Fate
                    break;

                case '2X_BET':
                case '2X_LESS_LOSE':
                case 'FREE_BUY_IN':
                case 'PAYING_EXTRA_BONUS':
                    templateId = '1'; //Gangplank
                    break;

                default:
                    throw new Error('Unknown buff name: ' + buffId);
            }

            var deferred = $q.defer();

            buffQueue = buffQueue.finally(function () {
                buffModalInstance = $uibModal.open({
                    templateUrl: '/src/html/modal/buff/buff-' + templateId + '.view.html',
                    backdrop: false,
                    scope: scope,
                    windowClass: 'modal-buff',
                    openedClass: 'modal-open-buff'
                });

                deferred.resolve(buffModalInstance);

                Analytics.trackEvent('buff', 'show', '', {templateId: templateId});

                return buffModalInstance.result.then(function () {
                    intercomService.emit('modalService.buffModalClosed');
                });
            });

            return deferred.promise;
        }

        /**
         * Открытие модального окна ошибки баланса
         * @param {string} templateId
         * @param {{bonus: number, count: number, value: number}} errorData
         * @return {angular.ui.bootstrap.IModalServiceInstance}
         */
        function openBalanceErrorModal(templateId, errorData) {
            var options = {
                controller: 'BalanceErrorModalController',
                windowClass: 'modal-balance-error'
            };
            templateId = 'balance-error/' + templateId;
            
            return openModal(templateId, options, errorData);
        }
    }

})();