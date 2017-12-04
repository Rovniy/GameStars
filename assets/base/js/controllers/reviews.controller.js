(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('ReviewsController', ReviewsController);

    ReviewsController.$inject = [];

    /* @ngInject */
    function ReviewsController() {
        var vm = this;

        vm.reviews = [
            {
                'name': 'Saloman',
                'rank': 'Silver V',
                'text': 'REVIEW_1'
            },
            {
                'name': 'HolyBrother',
                'rank': 'Gold I',
                'text': 'REVIEW_2'
            },
            {
                'name': 'Mr.Barmalej',
                'rank': 'Gold IV',
                'text': 'REVIEW_3'
            },
            {
                'name': '7method',
                'rank': 'Gold V',
                'text': 'REVIEW_5'
            },
            {
                'name': 'Neletrion',
                'rank': 'Silver V',
                'text': 'REVIEW_6'
            },
            {
                'name': 'NewLife Zubaskal',
                'rank': 'Platinum V',
                'text': 'REVIEW_7'
            },
            {
                'name': 'Slavkololo',
                'rank': 'Platinum V',
                'text': 'REVIEW_8'
            },
            {
                'name': 'Ggkas',
                'rank': 'Platinum III',
                'text': 'REVIEW_9'
            },
            {
                'name': 'Proprorok',
                'rank': 'Silver V',
                'text': 'REVIEW_10'
            },
            {
                'name': 'ScarletL',
                'rank': 'Silver V',
                'text': 'REVIEW_11'
            },
            {
                'name': 'E5 Rizze',
                'rank': 'Silver II',
                'text': 'REVIEW_12'
            },
            {
                'name': 'Zen0l',
                'rank': 'Platinum V',
                'text': 'REVIEW_13'
            },
            {
                'name': 'Variar',
                'rank': 'Platinum III',
                'text': 'REVIEW_14'
            }
        ];

        activate();

        ////////////////

        function activate() {
            
        }
    }

})();

angular.module('gamestar.base').controller('reviews', function ($scope, $http, $rootScope) {
    
});