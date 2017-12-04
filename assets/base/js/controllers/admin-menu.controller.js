(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('AdminMenuController', AdminMenuController);

    AdminMenuController.$inject = ['$rootScope', 'userProfileService', 'modalService', 'config', 'appTestService', 'intercomService'];

    /* @ngInject */
    /**
     * @param {angular.IRootScopeService} $rootScope
     * @param {userProfileService} userProfileService
     * @param {modalService} modalService
     * @param {config} config
     * @param {appTestService} appTestService
     * @param {intercomService} intercomService
     * @constructor
     */
    function AdminMenuController($rootScope, userProfileService, modalService, config, appTestService, intercomService) {
        var vm = this;
        
        vm.config = config;
        
        vm.isAdmin = isAdmin;
        vm.openIssueModal = openIssueModal;
        vm.test_matchCreated = test_matchCreated;
        vm.test_matchStarted = test_matchStarted;
        vm.test_matchEnded = test_matchEnded;
        vm.test_matchResult = test_matchResult;
        vm.test_close = test_close;
        vm.test_tournament = test_tournament;
        vm.animationStart = animationStart;
        vm.showBuff = showBuff;
        vm.test_matchCanceled = test_matchCanceled;

        ////////////////

        function isAdmin() {
            return userProfileService.isAdmin();
        }
        
        function openIssueModal() {
            modalService.openModal('issue.html', { controller: 'IssueModalController' });
        }
        
        function test_matchCreated() {
            appTestService.test_matchCreated();
        }
        
        function test_matchStarted() {
            appTestService.test_matchStarted();
        }
        
        function test_matchEnded() {
            appTestService.test_matchEnded();
        }
        
        function test_matchResult(isWin) {
            appTestService.test_matchResult(isWin);
        }
        
        function test_close() {
            appTestService.test_close();
        }
        
        function test_tournament(status) {
            appTestService.test_tournament(status);
        }
        
        function animationStart(part) {
            if (part == 'firstSession') {
                localStorage.removeItem('firstSession');
                $rootScope.$broadcast('play-first-session');
            } else if (part == 'firstJoin') {
                localStorage.removeItem('firstTournamentsSession');
                $rootScope.$broadcast('play-tournament-session');
            } else if (part == 'firstWin') {
                localStorage.removeItem('firstWinSession');
                test.multikFirstWin();
            } else if (part == 'firstLose') {
                localStorage.removeItem('firstLoseSession');
                test.multikFirstLose();
            }
        }
        
        function showBuff(buffId, activate) {
            var data = {
                message_type: activate ? 'ITEM_APPLIED' : 'ITEM_CREATED',
                count: 1000,
                item: { name: buffId }
            };

            intercomService.emit('incoming', data);
        }

        function test_matchCanceled() {
            appTestService.test_matchCanceled();
        }
    }

})();

