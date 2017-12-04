
// Контроллер модального окна
gamestar.controller('ModalTemp', function ($scope, $uibModal, $log, $rootScope) {
    // main params
    $scope.items = 1;
    $scope.modal = function (size, path, owner) {
        //console.log('ModelaTemp modal');
        if (owner) {
            var tplsrc = "./";
        } else {
            var tplsrc = 'src/html/modal/';
        }
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: tplsrc + path,
            controller: 'ModalCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        $scope.modalInstance.result.then(function (selectedItem) {
        });
    };
    $rootScope.openModal = $scope.modal;

    //$scope.modal('md', 'reminder.html');
    //$scope.modal('md', 'issue.html');
    //$scope.modal('md', 'login.html');
    //$scope.modal('md', 'exchange-sp.html');
    //$scope.modal('md', 'info-payments.html');

    //window.modal = function(formName){
    //    return $scope.modal('md', formName+'.html');
    //}

});




// Контроллер отрендеренного окна
gamestar.controller('ModalCtrl', function ($scope, $uibModalInstance, items, $http, $rootScope, http ) {

    $scope.EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.modalContentStatus = false;
    $scope.checkSignup = false;
    $scope.checkLogin = false;
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function () {
        $uibModalInstance.close( $scope.selected.item );
    };
    $scope.cancel = function () {
        console.log('cancel');
        $uibModalInstance.dismiss('cancel');
        //$scope.modalInstance.dismiss('cancel');

    };
    $scope.waitCallBack = false;

    $scope.signupBtnDisable = false;
    $scope.signup = function(){
        console.log('sign up');

        $scope.signupBtnDisable = true;
        var data =  {
            "email": $scope.signupEmail,
            "name": $scope.signupLogin,
            "password": $scope.signupPass,
            "acceptConditions": "true",
            "clientId": $rootScope.clientId,
            "referralId" : $scope.refLinkID,
            "tz": new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]
        };
        http.post('/api/signup', angular.toJson(data)  )
            .then(function successCallback(response) {
                ga('send', 'event', 'registration', 'submit', '');
                console.log('success');
                //$uibModalInstance.dismiss('cancel');
                $scope.modalSendComplate = true;
                document.location = window.location.protocol + '//' + window.location.host.replace(/^[^.]+\./g,'');

            }, function errorCallback(response) {
                $scope.signupBtnDisable = false;
                $scope.modalSendError = true;
                $scope.status = response.status;
                console.log('$scope.status: ', $scope.status);
                try {
                    $scope.errorType = response.data.error.type;
                    console.log('$scope.errorType : ', $scope.typeParseErr);

                } catch (err){
                    $scope.typeParseErr = err;
                    console.warn('errorType parse err: ', err);
                }
                try {
                    $scope.errorName = response.data.error.message.name[0];
                    console.log('$scope.errorName : ', $scope.errorName );

                } catch (err){
                    $scope.nameParseErr = err;
                    console.warn('errorMessage parse err: ', err);
                }

            })
        ;
    };

    // Login
    $scope.loginBtnDisable = false;

    $scope.restorePassword = function() {
        data = {
            "email": $scope.restoreEmail
        };
        http.post('/api/accounts/password/reset', data)
            .then(function successCallback(response) {
                $scope.reqSent = true;
            }, function errorCallback(response) {
            });
    };
       /*
        http.post('/api/accounts/password/reset', {email: $scope.restoreEmail}, function(err){
            console.error('err: ', err);
            $scope.reqSent = true;
        });
        //setTimeout(function(){
        //    //$uibModalInstance.dismiss('cancel');
        //    $scope.reqSent = true;
        //}, 1000)

    };
*/
    $scope.addFile = function(){
        console.log('addFile');
        //http.post('/api/reaction/report/upload', {}, function(FileUploader){
        //})
    };


    $scope.login = function(){
        $scope.loginBtnDisable = true;
        //console.log('login scope: ', $scope);
        //console.log('login root scope: ', $rootScope);

        var data =  {
            email: $scope.loginEmail,
            password: $scope.loginPass
        };
        http.post('/api/login', angular.toJson(data)  )
            .then(function successCallback(response) {
                console.log('success: ', response);
                $uibModalInstance.dismiss('cancel');
                document.location = window.location.protocol + '//' + window.location.host.replace(/^[^.]+\./g,'');
                //$scope.modalSendComplate = true;
                //document.location = 'http://game-stars.ru';
                //document.location = window.location.protocol + '//' + window.location.host.replace(/^[^.]+\./g,'');
            }, function errorCallback(response) {
                $scope.loginBtnDisable = false;
                $scope.modalSendError = response.data.type;
                $scope.status = response.status;
            })
        ;
    };

    // Обменять SP
    $scope.submitExchangeSP = function(){
        var data =  {
            "count" : $scope.numberExchangeSP
        };
        $scope.numberExchangeSP = '';
        $scope.reTourId = $routeParams.id;
        console.log($routeParams.id);
        $scope.postByuExchangeSP = '/api/tournament/'+ $scope.reTourId + '/buy';
        http.post($scope.postByuExchangeSP, angular.toJson(data)  )
            .then(function successCallback(response) {
                $scope.responseExchangeSP = response.status;
                window.sessionStorage.setItem('authStatus', null);
                window.location.href = window.location.href;
            }, function errorCallback(response) {
                $scope.responseExchangeSP = response.data.error.type;
            });
    }
});