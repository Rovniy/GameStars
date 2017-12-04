(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$q', 'localizationService' ,'config', 'userProfileService', 'authenticationService', 'modalService', 'findGameService', '$window'];

    /* @ngInject */
    /**
     * Контроллер хидера страницы
     * @param {angular.IQService} $q
     * @param {localizationService} localizationService
     * @param {config} config
     * @param {userProfileService} userProfileService
     * @param {authenticationService} authenticationService
     * @param {modalService} modalService
     * @param {findGameService} findGameService
     * @constructor
     */
    function HeaderController($q, localizationService, config, userProfileService, authenticationService, modalService, findGameService, $window) {
        var vm = this;

        vm.config = config;
        vm.avatars = [];
        vm.isAvatarsVisible = false;

        vm.loginEmail = '';
        vm.loginPass = '';
        vm.error = undefined;
        vm.status = undefined;
        vm.loading = false;

        vm.toggleAvatars = toggleAvatars;
        vm.setLanguage = setLanguage;
        vm.getCurrentLanguage = getCurrentLanguage;
        vm.getAvatarClass = getAvatarClass;
        vm.getUserProfile = getUserProfile;
        vm.getUserStarpoints = getUserStarpoints;
        vm.getUserRealpoints = getUserRealpoints;
        vm.selectAvatar = selectAvatar;
        vm.logout = logout;
        vm.login = login;
        vm.openLoginModal = openLoginModal;
        vm.openSignupModal = openSignupModal;
        vm.openPwdRestore = openPwdRestore;
        vm.openConnectAccountModal = openConnectAccountModal;
        vm.isVipStatus = isVipStatus;
        vm.getUserRealpointsVip = getUserRealpointsVip;
        vm.getUserRealpointsBonus = getUserRealpointsBonus;
        vm.showSupportNonLogin = showSupportNonLogin;
        vm.openPaymentModal = openPaymentModal;

        activate();

        ////////////////

        function login(){
            vm.loading = true;

            authenticationService
                .login(vm.loginEmail, vm.loginPass)
                .then(function (response) {
                    vm.error = undefined;
                })
                .catch(function (response) {
                    vm.error = response.data.error;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function activate() {
            for (var i = 1; i <= 36; i++){
                vm.avatars.push(i);
            }
        }

        function toggleAvatars() {
            vm.isAvatarsVisible = !vm.isAvatarsVisible;

            if (vm.isAvatarsVisible){
                $('body').on('click', _onOutClick);
            }
            else{
                $('body').off('click', _onOutClick);
            }
        }

        function setLanguage(lang){
            localizationService.setLanguage(lang);
        }

        function getCurrentLanguage(){
            return localizationService.getLanguage();
        }

        function getAvatarClass(){
            var profile = userProfileService.getUserProfile();

            if (profile){
                return 'avatar-' + profile.userData.avatarId;
            }
        }

        function getUserProfile(){
            return userProfileService.getUserProfile();
        }

        function getUserStarpoints(){
            return userProfileService.getUserStarpoints();
        }

        function getUserRealpoints(){
            var userRealpoints = userProfileService.getUserRealpoints();
            return (userRealpoints / 100).toFixed(2);
        }

        function getUserRealpointsVip(){
            return userProfileService.getUserRealpointsVip();
        }

        function getUserRealpointsBonus(){
            return userProfileService.getUserRealpointsBonus();
        }

        function selectAvatar(avatarId){
            userProfileService.updateAvatarId(avatarId);
        }

        function _onOutClick(event){
            if ($(event.target).parents('.b-user-bar_ava').length === 0){
                toggleAvatars();
            }
        }

        // Logout пользователя с сайта
        function logout() {
            var promise = findGameService.isTimerVisible() ? findGameService.applicationDisapply() : $q.resolve();

            return promise
                .finally(authenticationService.logout)
                .catch(function () {
                    console.log('logout-nooooooooooooo');
                });
        }

        function showSupportNonLogin() {
            console.log('1');
            $window.zE(function() {
                zE.show();
            });
        }


        function openLoginModal() {
            modalService.openModal('login.html', { controller: 'LoginModalController' });
        }

        function openSignupModal() {
            modalService.openModal('signup.html', { controller: 'SignupModalController', backdrop: 'static' });
        }

        function openPwdRestore() {
            modalService.openModal('reminder.html', { controller: 'RestorePwdController', backdrop: 'static' });
        }

        function openConnectAccountModal() {
            if (getUserProfile().options.isGameAccountLinked){
                return;
            }

            modalService.openModal('connect-account.html', { controller: 'AddAccountModalController' });
        }

        function isVipStatus() {
            return userProfileService.isVipStatus();
        }

        function openPaymentModal() {
            modalService.openModal('payment.html');
        }
    }

})();

