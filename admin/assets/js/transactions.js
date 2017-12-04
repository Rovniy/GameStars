angular.module('gsadmin').controller('transactions', function($http, $scope, $rootScope) {
    $scope.userName = $rootScope.modalData;

    $scope.addSomeMoney = function() {
        if ($scope.userAwardType == 'penalty') {
            if ($scope.penaltyType == 'tournamentGame') {
                $scope.data = {
                    'userId': $scope.userName,
                    'currencyType': 'TOURNAMENT_POINTS',
                    'event': 'PENALTY',
                    'valueType': 'MAIN',
                    'value': -$scope.tournamentGameChips,
                    'tournamentId': $scope.tournamentGameID
                };
            } else {
                $scope.data = {
                    'userId': $scope.userName,
                    'valueType': $scope.nonTournamentCurrency,
                    'currencyType': 'REAL_POINTS',
                    'event': 'PENALTY',
                    'value': -$scope.nonTournamentValue
                };
            }
        } else if ($scope.userAwardType == 'recalculation') {
            if ($scope.recalculationType == 'recalculationPlus') {
                $scope.data = {
                    'userId': $scope.userName,
                    'currencyType': 'TOURNAMENT_POINTS',
                    "event":"RECALCULATION",
                    'value': $scope.tournamentGameChips,
                    'valueType': 'MAIN',
                    'tournamentId': $scope.recalculationID
                };
            } else {
                $scope.data = {
                    'userId': $scope.userName,
                    'currencyType': 'TOURNAMENT_POINTS',
                    "event":"RECALCULATION",
                    'value': $scope.tournamentGameChips*(-1),
                    'valueType': 'MAIN',
                    'tournamentId': $scope.recalculationID
                };
            }
        } else if ($scope.userAwardType == 'bonus') {
            if ($scope.bonusType == 'bonusTour') {
                $scope.data = {
                    'userId': $scope.userName,
                    'currencyType': 'TOURNAMENT_POINTS',
                    "event":"BONUS",
                    'value': $scope.bonusChips,
                    'valueType': 'MAIN',
                    'tournamentId': $scope.bonusID
                };
            } else {
                $scope.data = {
                    'userId': $scope.userName,
                    'valueType': 'BONUS',
                    'currencyType': 'REAL_POINTS',
                    "event":"BONUS",
                    'value': $scope.bonusValue
                };
            }
        } else if ($scope.userAwardType == 'transferAward') {

            $scope.data = {
                'userId': $scope.userName,
                'valueType': $scope.transferAwardType,
                'currencyType': 'REAL_POINTS',
                "event":"TRANSFER_AWARD",
                'value': $scope.transferAwardValue,
                'tournamentId': $scope.transferAwardID
            };
        } else if ($scope.userAwardType == 'withdrow') {

            $scope.data = {
                'userId': $scope.userName,
                'valueType': 'MAIN',
                'currencyType': 'REAL_POINTS',
                'event': 'MONEY_WITHDRAWAL',
                'value': -$scope.withdrowValue
            };
        }

        console.log($scope.data);

        $http
            .post('/api/adm/transaction/add', $scope.data)
            .then(function () {
                $scope.allOK = 'ok';
            })
            .catch(function () {
                $scope.allOK = 'error';
            });
    }

});