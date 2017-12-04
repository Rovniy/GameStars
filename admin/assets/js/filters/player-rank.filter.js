(function () {
    'use strict';

    angular
        .module('gsadmin')
        .filter('playerRank', playerRank);

    function playerRank() {
        return playerRankFilter;

        ////////////////

        function playerRankFilter(value) {
            switch (value){
                case 'R1':
                    return 'Recruit';

                case 'R2':
                    return 'Private';

                case 'R3':
                    return 'Corporal';

                case 'R4':
                    return 'Sergeant';

                case 'R5':
                    return 'Sergeant-major';

                case 'R6':
                    return 'Lieutenant';

                case 'R7':
                    return 'Captain';

                case 'R8':
                    return 'Major';

                case 'R9':
                    return 'Lieutenant-colonel';

                case 'R10':
                    return 'Сolonel';

                case 'R11':
                    return 'General';

                case 'R12':
                    return 'Field-Marshal';
                
                default:
                    break;
            }
        }
    }

})();

