// Контроллер модального окна
angular.module('gsadmin').controller('ModalTemp', function ($scope, $uibModal, $rootScope) {


    // main params
    $scope.items = 1;
    $scope.modal = function (size, path, controller, data) {
        $rootScope.modalData = data;
        var tplsrc = 'html/modal/';
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: tplsrc + path,
            controller: controller,
            size: size,
            $scope: data,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                data: function() {
                    return data
                }
            }
        });
        $scope.modalInstance.result.then(function (selectedItem) {
            $rootScope.selected = selectedItem;});
    };

    $scope.openMoreInfo = function(id, game) {
        $rootScope.matchOpenId = id;
        $rootScope.matchOpenGame = game;

        $uibModal.open({
            templateUrl: 'html/modal/lol.html',
            size: 'lg',
            windowClass: 'modal-match-info'
        });
    }
});

// Контроллер отрендеренного окна
angular.module('gsadmin').controller('lolController', function ($scope, $rootScope, $http, $uibModal ) {

    //Массив со списком наказанных юзеров
    $scope.valArr = [];
    $scope.selectedUserViolate = {};

    $scope.getUserData = getUserData;
    $scope.getStat = getStat;
    $scope.getLevel = getLevel;
    $scope.getKills = getKills;
    $scope.getDeaths = getDeaths;
    $scope.getSpell1 = getSpell1;
    $scope.getSpell2 = getSpell2;
    $scope.adk = adk;
    $scope.murders = murders;
    $scope.commandSumPar = commandSumPar;
    $scope.isPenultimateAndLaggingBehindOthers = isPenultimateAndLaggingBehindOthers;
    $scope.isMinCommandValue = isMinCommandValue;
    $scope.ourRating = ourRating;
    $scope.mmr = mmr;

    $scope.modal = function (size, path, controller) {
        var tplsrc = 'html/modal/';
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: tplsrc + path,
            controller: controller,
            size: size
        });
    };


    $scope.baseSiteUrl = window.location.host.replace(/admin./g, '');

    $scope.selectedUsers = [];
    for (var i=0; i< 10; i++) $scope.selectedUsers[i] = false;
    $scope.violationType = 'LEAVER_INGAME';


    //console.log('gameInfo: ', $scope.gameInfo);
    $http.get('/api/adm/match/' + $rootScope.matchOpenId)
        .then(function successCallback(response) {
            $scope.gameInfo = response.data;
            $scope.matchCommands = $scope.gameInfo.matchCommands;
            $scope.matchInfo = $scope.gameInfo.matchInfo;

            if ($scope.matchInfo) {
                $scope.commandLen = $scope.matchInfo.matchCommands[0].matchApplications.length;
                $scope.appArr = $scope.matchInfo.matchCommands[0].matchApplications.concat($scope.matchInfo.matchCommands[1].matchApplications);
                $scope.matchUsers = {};
                $scope.matchInfo.matchCommands.forEach(function (matchCommand) {
                    matchCommand.matchApplications.forEach(function (app) {
                        $scope.matchUsers[app.user.id] = app.user;
                    })
                });

                for (var i = 0; i < $scope.appArr.length; i++) {
                    var userId = $scope.appArr[i].user.id;
                    var violations = $scope.gameInfo.violations[userId];
                    if (violations && violations[0]) {
                        $scope.selectedUserViolate[userId] = getViolationName(violations[0].violationType);
                    }
                }
            }

            $rootScope.hideLoadAnimation = true;
        }, function errorCallback(response) {
            console.log('Ошибка получения списка польователей', response);
        });

    //поиск и вынесение наказания пользователя(ей)
    $scope.punish = function(){
        //Генерируем массив одного наказания
        var violationGen = function(userIndex){
            return {
                matchId: $rootScope.matchOpenId,
                description: $scope.reason,
                target: $scope.appArr[userIndex].user.id,
                violationType: $scope.violationType
            }
        };
        //Генерируем полный список текущих новостей
        var violations = $scope.selectedUsers.map(function(fl, index){
            if (fl) return violationGen(index);
        }).filter(function(v){return v});

        //Добавляем в массив данных все наказания по этому матчу
        for (var t = 0; t < violations.length; t++) {
            $scope.valArr.push(violations[t]);
        }

        //Скрываем и отображаем статусы вынесенных наказаний
        for (var i = 0; i < $scope.selectedUsers.length; i++) {
            if ($scope.selectedUsers[i] == true) {
                $scope.selectedUserViolate[$scope.appArr[i].user.id] = getViolationName($scope.violationType);
            }
        }

        $scope.selectedUsers = [];
        for (var i=0; i< 10; i++) $scope.selectedUsers[i] = false;

        //Убираем check с checkbox'ов
        $scope.punishSelected = false;
    };

    //Отправка данных о наказанных юзерах на сервер
    $scope.postPunish = function() {

        //POST запрос данных на сервер
        $http.post('/api/reaction/punishment/create', {violations: $scope.valArr})
            .then(function(res){
                console.log('punishment res: ', res);
                $scope.punishSuccess = true;
                $scope.punishError = false;
                $scope.punishSelected = false;
                $scope.selectedUsers = [];
                $scope.reason = '';
                $scope.punished = true;

            }, function(err){
                console.error('punishment err: ', err);
                $scope.punishError = true;
                $scope.punishSuccess = false;

                $scope.punished = true;
            });
    };


    $scope.kda = function(stats){
        return (stats.championsKille+stats.assists)/(stats.numDeaths||1);
    };

    $scope.allTeamBid= function(index) {
        if (!$scope.matchInfo) {
            return;
        }

        return $scope.matchInfo.matchCommands[index].matchApplications.reduce(function(res, app, appIndex) {
            return res + app.actualBid;
        }, 0);
    };

   /* $scope.getReportsByUserId = function(userId){
        return $scope.gameInfo.reports.filter(function(report){
            var filterRes = report.report.target===userId;
            return filterRes;
        })
    };*/

    $scope.getReportsByUserId = function(userId){
        return $scope.gameInfo.reports.filter(function(report){
            return report.report.target === userId;
        });
    };

    $scope.cancel = function(){
        var users = $scope.selectedUsers.map(function(fl, userIndex){
            if (fl) return $scope.appArr[userIndex].user.id;

        }).filter(function(v){return v});
        var data = {
            matchId:  $rootScope.matchOpenId,
            faultUserIds: users
        };
        $http.post('/api/adm/lol/match/cancel', data)
            .then(function(res){
                $scope.cancelSuccess = true;
            }, function(err){
                $scope.cancelError = true;
            });
    };

    function getViolationName(violationType){
        switch (violationType) {
            case 'LEAVER_INGAME':
                return 'Ливер';

            case 'AFK':
                return 'АФК';

            case 'FEEDER':
                return 'Фидер';

            default:
                return 'Наказан';
        }
    }

    function getStat(matchApp){
        return getUserData(matchApp).stats || {};
    }

    function getStatByName(matchApp, name){
        switch (name){
            case 'championsKilled':
                return getKills(matchApp);

            case 'numDeaths':
                return getDeaths(matchApp);

            default:
                return getStat(matchApp)[name];
        }
    }

    function getUserData(matchApp){
        if (!$scope.gameInfo.statistic){
            return {};
        }
        return $scope.gameInfo.statistic.data[matchApp.gameAccount.accountID];
    }

    function getLevel(matchApp){
        var stats = getStat(matchApp);
        return !angular.isUndefined(stats.champLevel) ?
            stats.champLevel : stats.level;
    }

    function getKills(matchApp){
        var stats = getStat(matchApp);
        return !angular.isUndefined(stats.kills) ?
            stats.kills : stats.championsKilled;
    }

    function getDeaths(matchApp){
        var stats = getStat(matchApp);
        return !angular.isUndefined(stats.deaths) ?
            stats.deaths : stats.numDeaths;
    }

    function getSpell1(matchApp){
        var statistic = getUserData(matchApp);
        return !angular.isUndefined(statistic.spell1Id) ?
            statistic.spell1Id : statistic.spell1;
    }

    function getSpell2(matchApp){
        var statistic = getUserData(matchApp);
        return !angular.isUndefined(statistic.spell2Id) ?
            statistic.spell2Id : statistic.spell2;
    }

    function adk(matchApp){
        return (getStat(matchApp).assists + getKills(matchApp)) / (getDeaths(matchApp) || 1)
    }

    function murders(matchCommand, matchApp){
        try {
            var teamKilled = matchCommand.matchApplications.reduce(function(res, app, appIndex){
                return res + getKills(app);
            }, 0);
            var res = ($scope.getStat(matchApp).assists + getKills(matchApp)) / (teamKilled || 1) * 100;

            return res;
        }
        catch (err){
            return '-';
        }
    }

    function commandSumPar(matchCommand, name) {
        return matchCommand.matchApplications.reduce(function(res, app, appIndex) {
            return res + getStatByName(app, name);
        }, 0);
    }

    function isPenultimateAndLaggingBehindOthers(matchCommand, name, matchApplicationIndex){
        var props = matchCommand.matchApplications
            .map(function(app, appIndex) {
                return getStatByName(app, name);
            }, 0);

        var reserve = JSON.parse(JSON.stringify(props));

        props.sort(function(x, y){ return x>y });
        //todo: потестить
        return (props[1] + 100 < props[2]) && (reserve.indexOf(props[1]) === matchApplicationIndex);
    }

    function isMinCommandValue(matchCommand, matchApp, name){
        if (matchCommand.matchApplications) {
            var props = matchCommand.matchApplications
                .map(function (app, appIndex) {
                    return getStatByName(app, name);
                }, 0);
        }
        else {
            return false;
        }

        var minValue = Math.min.apply(null, props);
        var thisValue = getStatByName(matchApp, name);

        return minValue === thisValue;
    }

    function ourRating(matchCommand){
        return matchCommand.matchApplications.reduce(function(res, app, appIndex) {
            return res + app.rating;
        }, 0);
    }

    function mmr(matchCommand) {
        return matchCommand.matchApplications.reduce(function(res, app, appIndex) {
            return res + app.gameAccount.realRating;
        }, 0);
    }
});