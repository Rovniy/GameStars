(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .component('gsPayment', {
            templateUrl: '/src/html/templates/payment.view.html',
            controller: PaymentController,
            bindings: {
                providers: '@', // строка, список платежных провайдеров через запятую см. providers
                amount: '<', // сумма платежа
                purchaseType: '@', // строка, тип платежа (что покупается) STAR_POINTS / REAL_POINTS
                disabled: '<?', // отключение активности кнопок, не обязательно
                onSubmit: '&', // callback функция при клике по кнопке, не обязательно
                onSuccess: '&', // callback функция при успешной транзакции, не обязательно, вызывается только если нет перехода на страницу платежной системы
                onFailed: '&' // callback функция при неуспешном запросе, не обязательно
            }
        });

    /**
     * @typedef {object} PaymentProvider
     * @property {string} type
     * @property {string} imgUrl
     * @property {string} paymentMethod
     */
    /**
     * @type {{paypal: PaymentProvider, epg: PaymentProvider, psc: PaymentProvider, realpoints: PaymentProvider}}
     */
    var providers = {
        paypal: {
            type: 'paypal',
            imgUrl: '/src/img/payments/paypal.png',
            paymentMethod: 'PAYPAL'
        },
        epg: {
            type: 'epg',
            imgUrl: '/src/img/payments/card.png',
            paymentMethod: 'EPG'
        },
        psc: {
            type: 'psc',
            imgUrl: '/src/img/payments/paysafecard.png',
            paymentMethod: 'PAYSAFECARD'
        },
        realpoints: {
            type: 'REAL_POINTS',
            imgUrl: '/src/img/base/starclient-logo.png',
            paymentMethod: 'REAL_POINTS'
        }
    };

    PaymentController.$inject = ['paymentService', 'notificationService'];

    /* @ngInject */
    /**
     * @param {paymentService} paymentService
     * @param {notificationService} notificationService
     * @property {string} providers
     * @property {number} amount
     * @property {string} purchaseType
     * @property {boolean} disabled
     * @property {function} onSubmit
     * @property {function} onSuccess
     * @property {function} onFailed
     * @constructor
     */
    function PaymentController(paymentService, notificationService) {
        var ctrl = this;

        ctrl._providers = undefined;
        ctrl.loading = false;
        ctrl.error = false;

        ctrl.$onInit = $onInit;
        ctrl.onClick = onClick;
        ctrl.getElementClass = getElementClass;

        function $onInit() {
            if (ctrl.providers.length === 0){
                throw new Error('Empty providers');
            }

            var arr = ctrl.providers.split(',');
            ctrl._providers = [];

            for (var i = 0; i < arr.length; i++){
                var type = arr[i].toLowerCase().trim();
                var provider = providers[type];

                if (!provider){
                    throw new Error('Unknown provider: ' + type);
                }

                ctrl._providers.push(provider);
            }
        }

        function getElementClass(index) {
            var modulo = ctrl._providers.length % 3;
            var last = ctrl._providers.length - index;

            if (modulo !== 0 && last <= modulo && (last !== 1 || modulo === 1)){
                // не последний элемент в неполной строке (1 - 2 элемента)
                // offset 2 или 4
                return 'col-xs-offset-' + (4 / modulo);
            }
        }

        /**
         * @param {PaymentProvider} provider
         */
        function onClick(provider) {
            ctrl.onSubmit && ctrl.onSubmit({ provider: provider });

            ctrl.error = false;

            switch (provider.type){
                case 'paypal':
                case 'epg':
                case 'psc':
                    ctrl.loading = true;

                    var data = {
                        'paymentMethod': provider.paymentMethod,
                        'purchaseType' : ctrl.purchaseType,
                        'value': ctrl.amount
                    };

                    paymentService
                        .paymentTransaction(data)
                        .then(function (response) {
                            window.location.href = response.data.data.redirect_url;
                        })
                        .catch(function () {
                            ctrl.onFailed && ctrl.onFailed();
                            ctrl.error = true;
                        });
                    break;

                case 'REAL_POINTS':
                    ctrl.loading = true;

                    var data = {
                        'srcCurrency': provider.paymentMethod,
                        'destCurrency' : ctrl.purchaseType,
                        'value': ctrl.amount
                    };

                    paymentService
                        .conversionTransaction(data)
                        .then(function () {
                            ctrl.onSuccess && ctrl.onSuccess();
                            notificationService.success('PAYMENT__TRANSACTION_SUCCESS');
                        })
                        .catch(function () {
                            ctrl.onFailed && ctrl.onFailed();
                            $scope.error = true;
                        })
                        .finally(function () {
                            ctrl.loading = false;
                        });
                    break;

                default:
                    ctrl.onFailed && ctrl.onFailed();
                    console.warn('Unsupported type: ' + type);
                    break;
            }
        }
    }

})();