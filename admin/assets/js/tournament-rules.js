angular.module('gsadmin').controller('tournamentRules', function($http, $scope, $location) {

    $scope.getRules = function (lang) {
        $scope.url = '/api/agreement?lang=' + lang;
        $http.get($scope.url).then(function(response){
            $scope.rulesText = response.data.data.agreement.text;
        });
    }


});