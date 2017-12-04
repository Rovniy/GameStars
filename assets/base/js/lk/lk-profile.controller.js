(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('LkProfileController', LkProfileController);

    LkProfileController.$inject = ['$scope', 'userProfileService', 'notificationService', 'authenticationService', 'config'];

    /* @ngInject */
    /**
     * 
     * @param $scope
     * @param {userProfileService} userProfileService
     * @param {notificationService} notificationService
     * @param {authenticationService} authenticationService
     * @param {config} config
     * @constructor
     */
    function LkProfileController($scope, userProfileService, notificationService, authenticationService, config) {
        var vm = this;
        
        vm.userProfile = undefined;
        vm.loading = false;
        vm.inputUsername = undefined;
        vm.config = config;
        
        vm.lkSaveMyProfile = lkSaveMyProfile;
        vm.lkNewPass = lkNewPass;
        vm.lkNewUsername = lkNewUsername;
        vm.getUserProfile = getUserProfile;
        vm.externalLogin = externalLogin;

        activate();

        ////////////////

        function activate() {
            userProfileService
                .loadUserProfile()
                .then(function(userProfile){
                    vm.userProfile = userProfile;

                    vm.inputUsername = vm.userProfile.userData.name;
                    if (vm.userProfile.userData.phone) $scope.inputPhone = vm.userProfile.userData.phone;
                    if (vm.userProfile.userData.firstName) $scope.inputFirstname = vm.userProfile.userData.firstName;
                    if (vm.userProfile.userData.lastName) $scope.inputSecondname = vm.userProfile.userData.lastName;
                    if (vm.userProfile.userData.birthday) $scope.inputBithday = vm.userProfile.userData.birthday;
                    if (vm.userProfile.userData.tz) vm.inputTimezone = vm.userProfile.userData.tz;

                    userProfile.linkedAccounts.forEach(function(f){
                        if (f == 'twitch') vm.twitch = true;
                        if (f == 'facebook') vm.facebook = true;
                    })
                });
        }

        //Сохранение данных профайла
        function lkSaveMyProfile() {
            var data = {
                "firstName": $scope.inputFirstname,
                "lastName": $scope.inputSecondname,
                "birthday": inputBithday.value,
                "address":{
                    "country": $scope.inputCountry,
                    "city": $scope.inputCity,
                    "street": $scope.inputAdress,
                    "postAddress": $scope.inputPost
                },
                "phone": $scope.inputPhone,
                "tz": vm.inputTimezone
            };

            if (/[0-9]/.test($scope.inputFirstname)) {
                if ($scope.inputFirstname!==undefined) {
                    $scope.error = true;
                }
            }
            if (/[0-9]/.test($scope.inputSecondname)) {
                if ($scope.inputSecondname!==undefined) {
                    $scope.error = true;
                }
            }
            if (/[0-9]/.test($scope.inputCountry)) {
                if ($scope.inputCountry!==undefined) {
                    $scope.error = true;
                }
            }
            if (/[0-9]/.test($scope.inputCity)) {
                if ($scope.inputCity!==undefined) {
                    $scope.error = true;
                }
            }
            if (!/[0-9]/.test($scope.inputPost)) {
                if ($scope.inputPost!==undefined) {
                    $scope.error = true;
                }
            }

            console.log(data);

            if ($scope.error != true) {
                vm.loading = true;
                
                userProfileService
                    .updateProfile(data)
                    .then(function(){
                        vm.loading = false;
                        notificationService.success('LK__SAVED');
                    });
            }
            else {
                $scope.error = 'заполните все поля!!!';
            }
        }

        //Функция смены пароля в личном кабинете
        function lkNewPass() {
            $scope.error = false;
            $scope.repeatNewPassError = false;
            $scope.newPassError = false;

            if ($scope.inputNewPass != null && $scope.inputNewPass != $scope.repeatNewPass) {
                $scope.repeatNewPassError = true;
                $scope.error = true;
            }

            if ($scope.error != true) {
                vm.loading = true;
                userProfileService
                    .updatePassword($scope.inputOldPass, $scope.inputNewPass)
                    .then(function(){
                        notificationService.success('LK__PWD_CHANGED');
                    })
                    .catch(function(){
                        if (response.data.error.type == 'ValidationException') {
                            $scope.newPassError = 'Only Latin characters from 8 to 16 characters'
                        }
                        if (response.data.error.type == 'WrongPasswordException') {
                            $scope.newPassError = 'The old password is incorrect'
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            else {
                $scope.repeatNewPassError = true;
                console.log($scope.error);
            }
        }

        //Функция смены имени пользователя
        function lkNewUsername() {
            var userName = (vm.inputUsername || '').trim();

            vm.loading = true;
            userProfileService
                .updateUsername(userName)
                .then(function(){
                    notificationService.success('LK__NICK_CHANGED');
                })
                .catch(function(){
                    notificationService.success('LK__NICK_RESTRICTIONS');
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getUserProfile(){
            return userProfileService.getUserProfile();
        }

        function externalLogin(provider, url) {
            console.log(provider, url);
            authenticationService.externalLogin(provider, url);
        }
    }

})();