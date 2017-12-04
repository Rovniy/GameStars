(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('chatSystem', chatSystem);

    chatSystem.$inject = ['$scope', '$rootScope', '$window', '$interval', 'config', 'socketService'];

    /* @ngInject */
    /**
     * @param $scope
     * @param $rootScope
     * @param $window
     * @param {angular.IIntervalService} $interval
     * @param {config} config
     * @param {socketService} socketService
     * @constructor
     */
    function chatSystem($scope, $rootScope, $window, $interval, config, socketService) {
        var vm = this;
        var historyLoaded = false;

        vm.sendingMsg = $scope.sendingMsg;

        $scope.sendingMsg = false;

        //Массивы чатов
        $rootScope.generalChatMsg = []; //чат на главной
        $rootScope.tournamentChatMsg = []; //турнирный чат
        $rootScope.matchChatMsg = []; //чат матча

        /**
         * Отправляемое сообщение
         * msgManager(ID чат-комнаты, сообщение, тип сообщения, получатель)
         * chatID = chat room ID
         * msg = string
         * type = CHAT_MESSAGE
         * receiver = string
         **/
        $rootScope.msgManager = function(chatID, msg, type, receiver) {
            //Если сообщение не пустое, то отправляй
            if (msg) {
                if (chatID == config.p2pChats.prefix) {
                    var sendP2PData = {
                        'text': msg,
                        'message_type': type,
                        'receiver': receiver
                    };
                    $rootScope.pearToPearAreaMsgInput = '';
                    socketService.sendMessage(sendP2PData);
                } else if (chatID == config.generalChat.prefix) {
                    var sendGeneralChatData = {
                        'text': msg,
                        'message_type': type,
                        'room_id': chatID
                    };
                    $rootScope.inputCashGamesChatMsg = '';
                    socketService.sendMessage(sendGeneralChatData);
                } else {
                    //Формируем сообщение для отправки
                    var sendData = {
                        'room_id': chatID,
                        'text': msg,
                        'message_type': type
                    };
                    $scope.sendingMsg = true; // Дизейблик кнопку отправки сообщения
                    $rootScope.inputCashGamesChatMsg = ''; //Очищаем строку ввода сообщения
                    $rootScope.inputMatchChatMsg = ''; //Очищаем строку ввода сообщения

                    //Отдаем сообщение в сокет
                    socketService.sendMessage(sendData);
                }
            } else {
                var messageError = {
                    'date': new Date(),
                    'room_id': chatID,
                    'sender': 'GameStars Server',
                    'sender_id': '',
                    'text': 'The message can\'t be blank...',
                    'message_type': 'CHAT_MESSAGE'
                };
                if (chatID.indexOf('tournament_') + 1) {
                    $rootScope.tournamentChatMsg.push(messageError);
                    $interval(function() {
                        var tournamentChatArea = document.getElementById("tournamentChatArea");
                        tournamentChatArea.scrollTop = 9999999;
                    }, 200, 2);
                } else if (chatID == config.generalChat.prefix) {
                    $rootScope.generalChatMsg.push(messageError);
                    $interval(function() {
                        var cashGamesChatArea = document.getElementById("cashGamesChatArea");
                        cashGamesChatArea.scrollTop = 9999999;
                    }, 200, 2);
                } else {
                    $rootScope.matchChatMsg.push(messageError);
                    $interval(function() {
                        var tournamentChatArea = document.getElementById("tournamentChatArea");
                        tournamentChatArea.scrollTop = 9999999;
                    }, 200, 2);
                }
            }

        };

        // Получаемое сообщение
        $window.incomingMsg = function(msg) {
            if (msg.message_type == 'CHAT_MESSAGE') {
                var message = {
                    'date': msg.date,
                    'room_id': msg.room_id,
                    'sender': msg.sender_nick,
                    'sender_id': msg.sender,
                    'text': msg.text,
                    'message_type': msg.message_type
                };
                if (msg.room_id.indexOf('tournament_') + 1) {
                    $scope.sendingMsg = false;
                    $rootScope.tournamentChatMsg.push(message);
                    $interval(function() {
                        var tournamentChatArea = document.getElementById("tournamentChatArea");
                        tournamentChatArea.scrollTop = 9999999;
                    }, 100, 2);
                } else if (msg.room_id.indexOf('group_general') + 1) {
                    $scope.sendingMsg = false;
                    $rootScope.generalChatMsg.push(message);
                    $interval(function() {
                        var generalChatArea = document.getElementById("cashGamesChatArea");
                        generalChatArea.scrollTop = 9999999;
                    }, 100, 2);
                } else {
                    $scope.sendingMsg = false;
                    $rootScope.matchChatMsg.push(message);
                    $interval(function() {
                        var matchChatArea = document.getElementById("matchChatArea");
                        matchChatArea.scrollTop = 9999999;
                    }, 100, 2);
                }
            }
            else if (msg.message_type == 'CHAT_LOAD_HISTORY') {
                // костыль на загрузку хистори из другой вкладки
                if (historyLoaded){
                    return;
                }
                if (msg.room_id.indexOf('tournament_') + 1) {
                    historyLoaded = true;
                    var length = msg.messages.length-1;
                    for (var y = length; y > -1; y--) {
                        $scope.history = {
                            'date': msg.messages[y].date,
                            'room_id': msg.messages[y].room_id,
                            'sender': msg.messages[y].sender_nick,
                            'sender_id': msg.messages[y].sender,
                            'text': msg.messages[y].text,
                            'message_type': msg.messages[y].message_type
                        };
                        $rootScope.tournamentChatMsg.push($scope.history);
                    }
                    $interval(function() {
                        var tournamentChatArea = document.getElementById("tournamentChatArea");
                        tournamentChatArea.scrollTop = 9999999;
                    }, 100, 2);
                } else if (msg.room_id.indexOf('group_general') + 1) {
                    historyLoaded = true;
                    var lengthGeneral = msg.messages.length-1;
                    for (var zz = lengthGeneral; zz > -1; zz--) {
                        $scope.history = {
                            'date': msg.messages[zz].date,
                            'room_id': msg.messages[zz].room_id,
                            'sender': msg.messages[zz].sender_nick,
                            'sender_id': msg.messages[zz].sender,
                            'text': msg.messages[zz].text,
                            'message_type': msg.messages[zz].message_type
                        };
                        $rootScope.generalChatMsg.push($scope.history);
                    }
                    $interval(function() {
                        var cashGamesChatArea = document.getElementById("cashGamesChatArea");
                        cashGamesChatArea.scrollTop = 9999999;
                    }, 100, 2);
                }
            }
            else if (msg.message_type == 'CHAT_ERROR') {
                if (msg.room_id.indexOf('tournament_') + 1) {
                    $scope.tooManyMessages = {
                        'date': new Date(),
                        'room_id': msg.room_id,
                        'sender': 'GameStars Server',
                        'sender_id': '',
                        'text': 'Too many messages per second',
                        'message_type': 'TOO_MANY_MESSAGES'
                    };
                    $rootScope.tournamentChatMsg.push($scope.tooManyMessages);
                    $scope.sendingMsg = false;
                    $interval(function() {
                        var tournamentChatArea = document.getElementById("tournamentChatArea");
                        tournamentChatArea.scrollTop = 9999999;
                    }, 100, 2);
                } else if (msg.room_id.indexOf('group_general') + 1) {
                    $scope.tooManyMessages = {
                        'date': msg.date,
                        'room_id': msg.room_id,
                        'sender': 'GameStars Server',
                        'sender_id': '',
                        'text': 'Too many messages per second',
                        'message_type': 'TOO_MANY_MESSAGES'
                    };
                    $rootScope.generalChatMsg.push($scope.tooManyMessages);
                    $scope.sendingMsg = false;
                    $interval(function() {
                        var cashGamesChatArea = document.getElementById("cashGamesChatArea");
                        cashGamesChatArea.scrollTop = 9999999;
                    }, 100, 2);
                }

            }
            else if (msg.message_type == 'CHAT_DIRECT') {
                $rootScope.sendP2PChatMsg(msg);
            }
        };
    }
})();