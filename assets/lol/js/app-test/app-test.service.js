(function () {
    'use strict';

    angular
        .module('gamestar')
        .service('appTestService', appTestService);

    appTestService.$inject = ['$rootScope', '$q', '$location', '$timeout', 'intercomService'];

    /* @ngInject */
    /**
     * @param $rootScope
     * @param {angular.IQService} $q
     * @param {angular.ILocationService} $location
     * @param {angular.ITimeoutService} $timeout
     * @param {intercomService} intercomService
     */
    function appTestService($rootScope, $q, $location, $timeout, intercomService) {
        var enabled = false;
        var lobby = {
            "method": "/api/lol/match/0/lobby",
            "status": 1,
            "data": {
                "match_id": "0",
                "url_link": "EUW04208-c47f0bb5-adc2-4c4e-9f47-a3a51300e7a6",
                "bet": 50,
                "delayed": false,
                "countdown": 119,
                "status": "CREATED",
                "team": "ZERO",
                "match_info": {
                    "map": 11,
                    "team_size": 2,
                    "mode": "tournament",
                    "bet_type": "TOURNAMENT_POINTS",
                    "game_region": {"id": 1, "regionName": "EU West", "regionId": "EUW", "gameType": "LOL"}
                },
                "team_one": [{
                    "avatar_id": 21,
                    "name": "Exiqute",
                    "rank": "R2",
                    "player_id": "2c0170f3-417a-48dc-92b4-e9b985f5b013",
                    "is_ready": true
                }, {
                    "avatar_id": 3,
                    "name": "DarknessClaw94",
                    "rank": "R2",
                    "player_id": "ccb0fe50-4c55-48a3-aeae-a4cfd5bb340d",
                    "is_ready": false
                }],
                "team_two": [{"avatar_id": 31, "name": "welcome to USSR", "is_ready": false}, {
                    "avatar_id": 33,
                    "name": "Pogranichnick",
                    "is_ready": false
                }]
            }
        };
        var matchResult = {
            "method": "/api/lol/match/1d1d4e8a-56cb-4d7e-93ca-48265004ac66/result",
            "status": 1,
            "data": {
                "match_id": "1d1d4e8a-56cb-4d7e-93ca-48265004ac66",
                "bet": 50,
                "delayed": false,
                "countdown": 0,
                "status": "COMPLETED",
                "match_info": {"map": 11, "team_size": 2, "mode": "tournament", "bet_type": "TOURNAMENT_POINTS"},
                "team_one": [{
                    "avatar_id": 21,
                    "name": "Exiqute",
                    "rank": "R2",
                    "player_id": "2c0170f3-417a-48dc-92b4-e9b985f5b013",
                    "is_ready": false
                }, {
                    "avatar_id": 3,
                    "name": "DarknessClaw94",
                    "rank": "R2",
                    "player_id": "ccb0fe50-4c55-48a3-aeae-a4cfd5bb340d",
                    "is_ready": false
                }],
                "team_two": [{
                    "avatar_id": 31,
                    "name": "welcome to USSR",
                    "rank": "R2",
                    "player_id": "2dae5e7d-1317-4e4b-ab73-a21958e740b8",
                    "is_ready": false
                }, {
                    "avatar_id": 33,
                    "name": "Pogranichnick",
                    "rank": "R2",
                    "player_id": "216441c5-b8f2-4bcd-a572-0cd1fe04d432",
                    "is_ready": false
                }],
                "player_result": {
                    "exp": 35,
                    "exp_delta": 9,
                    "award": -50,
                    "is_win": false,
                    "winrate": "51.5"
                },
                "duration": 805
            }
        };
        var userStatus = {
            "actualMatchApplications": [],
            "actualMatches": [{
                "id": 0,
                "status": 'CREATED'
            }]
        };
        var tournament = {
            "method": "/api/tournament/0",
            "status": 1,
            "data": {
                "conditions": {
                    "en": "<ul><li>The Tournament is held on the EU West server.</li><li>The Tournament matches are open on 18th of February 2016, from 5.00 PM to 00.00 AM, Central European Time.</li><li>In each match you must make a bet with chips. When you accept a match, your bet is blocked. When you lose, you lose your bet. When you win, your blocked bet + extra chips in the amount of the bet you made are returned to you.</li><li>The winners are determined by the number of the chips won.</li><li>To become a qualified participant you should play at least 3 matches.</li></ul>",
                    "ru": "<ul><li>Турнир проводится на сервере EU West.</li><li>Матчи турнира открыты для участия 18 февраля с 17.00 до 00.00 по центральному европейскому времени.</li><li>В каждом матче нужно делать ставку фишками. Когда ты принимаешь матч - ставка замораживается. Когда проигрываешь - теряешь ставку. Когда выигрываешь - возвращается замороженная ставка + дополнительные фишки в размере, равном совершенной ставке.</li><li>Победители определяются по количеству заработанных фишек.</li><li>На призовое место можно претендовать, отыграв не менее 3х матчей.</li></ul>"
                },
                "tournament_info": {
                    "class": "NORMAL",
                    "status": "FINISH",
                    "buy_in": [{value: 100, stack: 1000, currencyType: "REAL_POINTS", default: true}],
                    "buy_in_type": "STAR_POINTS",
                    "reg_start_date": 1455267600,
                    "start_date": 1455811200,
                    "end_date": 1455836400,
                    "time_zone": "Europe/Berlin",
                    "name": "Daily Stars",
                    "blind_min": 0,
                    "blind_max": 0
                },
                "stats": {
                    "max_stack": 4860.0,
                    "min_stack": 0.0,
                    "avg_stack": 999.0,
                    "active_members": 107,
                    "out_members": 0,
                    "match_count": 25
                },
                "blind_calendar": [{
                    "text": "17:00-18:00",
                    "min": 10,
                    "max": 50,
                    "active": false,
                    "startDate": 1455811200000,
                    "endDate": 1455814800000
                }, {
                    "text": "18:00-19:00",
                    "min": 20,
                    "max": 100,
                    "active": false,
                    "startDate": 1455814800000,
                    "endDate": 1455818400000
                }, {
                    "text": "19:00-20:00",
                    "min": 40,
                    "max": 200,
                    "active": false,
                    "startDate": 1455818400000,
                    "endDate": 1455822000000
                }, {
                    "text": "20:00-21:00",
                    "min": 80,
                    "max": 400,
                    "active": false,
                    "startDate": 1455822000000,
                    "endDate": 1455825600000
                }, {
                    "text": "21:00-22:00",
                    "min": 160,
                    "max": 800,
                    "active": false,
                    "startDate": 1455825600000,
                    "endDate": 1455829200000
                }, {
                    "text": "22:00-23:00",
                    "min": 320,
                    "max": 1600,
                    "active": false,
                    "startDate": 1455829200000,
                    "endDate": 1455832800000
                }, {
                    "text": "23:00-00:00",
                    "min": 640,
                    "max": 3200,
                    "active": false,
                    "startDate": 1455832800000,
                    "endDate": 1455836400000
                }],
                "award_list": [{"award": 5000.0, "position": "1"}, {"award": 3000.0, "position": "2"}, {
                    "award": 2000.0,
                    "position": "3"
                }],
                "award_count": 3,
                "award_type": "REAL_POINTS",
                "award_fund": 10000,
                "reg_countdown": 0,
                "start_countdown": 0,
                "blind_countdown": 0,
                "game_region": {"id": 1, "regionName": "EU West", "regionId": "EUW", "gameType": "LOL"}
            }
        };
        var tournamentMy = {
            "method": "/api/tournament/0/me",
            "status": 1,
            "data": {"ladder": 0, "matchCount": 0, "status": "NONE"}
        };
        var ladder = {
            "method": "/api/tournament/0/ladder",
            "status": 1,
            "data": {
                "players": [{
                    "name": "Mantis94",
                    "stackCount": 1000,
                    "matchCount": 0,
                    "rank": "R5",
                    "status": "PLAYING",
                    "email": "radarada@interia.eu"
                }, {
                    "name": "Smart",
                    "stackCount": 1000,
                    "matchCount": 0,
                    "rank": "R4",
                    "status": "PLAYING",
                    "email": "vazz2234@gmail.com"
                }, {
                    "name": "FiveHere",
                    "stackCount": 1000,
                    "matchCount": 0,
                    "rank": "R2",
                    "status": "PLAYING",
                    "email": "fivegamingpl@gmail.com"
                }, {
                    "name": "Kikaashe",
                    "stackCount": 1000,
                    "matchCount": 0,
                    "rank": "R3",
                    "status": "PLAYING",
                    "email": "kika.stamenkovic@gmail.com"
                }, {
                    "name": "Monster9800",
                    "stackCount": 1000,
                    "matchCount": 0,
                    "rank": "R4",
                    "status": "PLAYING",
                    "email": "juliuszurbanski18@gmail.com"
                }]
            }
        };
        var testData = {
            '/api/lol/match/status/user': userStatus,
            '/api/lol/match/0/lobby': lobby,
            '/api/lol/match/0/result': matchResult,
            '/api/tournament/0': tournament,
            '/api/tournament/0/me': tournamentMy,
            '/api/tournament/0/ladder': ladder
        };

        this.enable = enable;
        this.disable = disable;
        this.hasTestResponse = hasTestResponse;
        this.getTestResponse = getTestResponse;
        this.test_matchCreated = test_matchCreated;
        this.test_matchStarted = test_matchStarted;
        this.test_matchEnded = test_matchEnded;
        this.test_matchResult = test_matchResult;
        this.test_close = test_close;
        this.test_tournament = test_tournament;
        this.test_matchCanceled = test_matchCanceled;

        ////////////////

        function enable() {
            enabled = true;
        }

        function disable() {
            enabled = false;
        }

        function hasTestResponse(url) {
            return enabled && testData.hasOwnProperty(url);
        }

        function getTestResponse(url) {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve({data: testData[url]});
            }, getRandomInt(100, 800));

            return deferred.promise;// $q.when({data: testData[url]});
        }

        function test_matchCreated() {
            enable();
            userStatus.actualMatches[0].status = lobby.status = 'CREATED';
            intercomService.emit('incoming', {message_type: 'MATCH_CREATED', match_id: '0'});
        }

        function test_matchStarted() {
            enable();
            userStatus.actualMatches[0].status = lobby.status = 'STARTED';
            intercomService.emit('incoming', {message_type: 'MATCH_STARTED', match_id: '0'});
        }

        function test_matchCanceled() {
            enable();
            userStatus.actualMatches[0].status = lobby.status = 'DESTROYED';
            intercomService.emit('incoming', {message_type: 'MATCH_DESTROYED', match_id: '0', matchExtStatus: 'NOT_STARTED_IN_LOBBY'});
        }


        function test_matchEnded() {
            enable();
            userStatus.actualMatches[0].status = lobby.status = 'FINISHED';
            intercomService.emit('incoming', {message_type: 'MATCH_FINISH', match_id: '0'});
        }

        function test_matchResult(isWin) {
            enable();
            userStatus.actualMatches[0].status = lobby.status = 'COMPLITED';
            matchResult.data.player_result.is_win = isWin;
            intercomService.emit('incoming', {message_type: 'MATCH_RESULTS_RECEIVED', match_id: '0'});
        }

        function test_close() {
            disable();
            $rootScope.modalInstance && $rootScope.modalInstance.close();
        }

        function test_tournament(status) {
            enable();
            tournament.data.tournament_info.status = status;
            $location.path('/tournament/lol/0');
        }

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         * @param {number} min
         * @param {number} max
         * @returns {number}
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

})();