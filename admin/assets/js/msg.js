angular.module('gsadmin').controller('msg', function($scope, $http, $rootScope, $routeParams){

    console.log('$routeParams: ', $routeParams);

    console.log('msg scope: ', $scope);

    $scope.sendMsg = function(){

        console.log('sendMsg');
        //console.log('$rootScope.userProfie: ', $rootScope.userProfie);

        var data = {
            //message_type: $scope.message_type,
            message: $scope.message,
            transportType: $scope.transportType||'WEB',
            userId: $rootScope.userId
        };


        function jsonToQueryString(json) {
            return '?' +
                Object.keys(json).map(function(key) {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
                }).join('&');
        }

        console.log('msg request:', data);
        $http.get('/api/adm/event/sendMessage'+jsonToQueryString(data)).then(function(res){
            console.log('res: ', res);
            console.log('data: ', res.data);
            $scope.msgSended = true;
            $scope.msgSendError = false;
            $scope.msgSendSuccess = true;

        }, function(res){
            console.log('err: ', res);
            console.log('data: ', res.data);
            $scope.msgSended = true;
            $scope.msgSendError = true;
            $scope.msgSendSuccess = false;
        })

    }

});