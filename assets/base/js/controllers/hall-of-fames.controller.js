(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('HallOfFamesController', HallOfFamesController);

    HallOfFamesController.$inject = [];

    /* @ngInject */
    function HallOfFamesController() {
        var vm = this;

        vm.halloffames = [
            {
                'username': 'Dorofeeva',
                'server': 'EU West',
                'rank': 'R3',
                'img': 'user9',
                'game': 'lol'
            },
            {
                'username': 'E5 RizZe',
                'server': 'EU West',
                'rank': 'R2',
                'img': 'user1',
                'game': 'lol'
            },
            {
                'username': 'Foksler',
                'server': 'EU West',
                'rank': 'R4',
                'img': 'user2',
                'game': 'lol'
            },
            {
                'username': 'Neletrion',
                'server': 'EU West',
                'rank': 'R2',
                'img': 'user3',
                'game': 'lol'
            },
            {
                'username': 'GGkas',
                'server': 'EU West',
                'rank': 'R4',
                'img': 'user4',
                'game': 'lol'
            },
            {
                'username': 'VapoRazor',
                'server': 'EU West',
                'rank': 'R1',
                'img': 'user5',
                'game': 'lol'
            },
            {
                'username': 'Jozzik',
                'server': 'EU West',
                'rank': 'R2',
                'img': 'user6',
                'game': 'lol'
            },
            {
                'username': 'Terrabayt',
                'server': 'EU West',
                'rank': 'R3',
                'img': 'user7',
                'game': 'lol'
            },
            {
                'username': 'MrBarmalej',
                'server': 'EU West',
                'rank': 'R3',
                'img': 'user8',
                'game': 'lol'
            }
        ];

        activate();

        ////////////////

        function activate() {
            
        }
    }

})();