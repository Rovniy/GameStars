(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('ApplicationsController', ApplicationsController);

    ApplicationsController.$inject = ['applicationsService'];

    /* @ngInject */
    /**
     * @param {applicationsService} applicationsService
     * @constructor
     */
    function ApplicationsController(applicationsService) {
        var vm = this;

        /**
         * @type {{ REAL_POINTS: object, STAR_POINTS: object, TOURNAMENT_POINTS: object }}
         */
        vm.applications = undefined;
        vm.loading = false;

        vm.getApplications = getApplications;

        activate();

        ////////////////

        function activate() {
            return getApplications();
        }
        
        function getApplications() {
            vm.loading = true;
            
            return applicationsService
                .getApplications('lol') // TODO: хардкод
                .then(function (applications) {
                    vm.applications = applications;

                    extendRegionMap(vm.applications.REAL_POINTS);
                    extendRegionMap(vm.applications.STAR_POINTS);
                    extendRegionMap(vm.applications.TOURNAMENT_POINTS);
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
        
        function extendRegionMap(regionMap) {
            var region;

            for (var prop in regionMap){
                if (!regionMap.hasOwnProperty(prop)){
                    continue;
                }

                region = regionMap[prop];
                region._arr = mapToArray(region);
            }
        }

        function mapToArray(map) {
            var arr = [];
            /** @type {[*]} */
            var tmpArr;
            var item;

            for (var prop in map){
                if (!map.hasOwnProperty(prop)){
                    continue;
                }

                tmpArr = (map[prop].queue && map[prop].queue[0]) || [];

                for (var i = 0; i < tmpArr.length; i++){
                    item = tmpArr[i];
                    item._tournamentId = prop;
                    arr.push(item);
                }
            }

            return arr;
        }
    }

})();