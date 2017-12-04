(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('OverlayController', OverlayController);

    OverlayController.$inject = ['$scope', '$rootScope', '$cookies', '$timeout', 'socketService', 'friendsService', 'userProfileService'];

    /* @ngInject */
    /**
     * @param $scope
     * @param $rootScope
     * @param $cookies
     * @param {angular.ITimeoutService} $timeout
     * @param {socketService} socketService
     * @param {friendsService} friendsService
     * @param {userProfileService} userProfileService
     * @constructor
     */
    function OverlayController($scope, $rootScope, $cookies, $timeout, socketService, friendsService, userProfileService) {
        var vm = this;
        var statusClassMap = {
            online: 'status-online',
            offline: 'status-offline',
            idle: 'status-idle',
            busy: 'status-busy'
        };
        var userStatusMap = {};

        $scope.showFriends = false; // Отображение окна френдов
        $scope.showMoreInfo = false; // Отображение дополнительной инфы о френде
        $scope.showChatArea = false; // Отображение окна чата
        $scope.keyValue = ''; // Счетчик открытых окон о пользователе
        $scope.searchArray = []; // Массив поиска
        $scope.senders = [];// Массив текущих чатов
        $scope.systemNoty = [];// Массив текущих чатов
        $scope.notyCounter = $scope.systemNoty.length; // Счетчик новых уведомления
        $scope.friendsArray = [];

        $scope.wsOpenDetect = wsOpenDetect;
        $scope.setCookies = setCookies;
        $scope.openSystemNoty = openSystemNoty;
        $scope.showNoties = showNoties;
        $scope.closeSystemNoty = closeSystemNoty;
        $scope.sendInvite = sendInvite;
        $scope.blockUser = blockUser;
        $scope.changeStatus = changeStatus;
        $scope.acceptFriend = acceptFriend;
        $scope.declineFriend = declineFriend;
        $scope.deleteFriend = deleteFriend;
        $scope.searchUserInput = searchUserInput;
        $scope.delChat = delChat;
        $scope.createChat = createChat;
        $scope.countFriends = countFriends;
        $scope.countOnlineFriends = countOnlineFriends;
        $scope.countNewFriends = countNewFriends;
        $scope.getStatusClass = getStatusClass;
        $scope.getUserStatus = getUserStatus;
        $scope.getMyStatus = getMyStatus;

        $rootScope.getUserInfo = getUserInfo;
        $rootScope.sendP2PChatMsg = sendP2PChatMsg;


        activate();

        ////////////////

        function activate() {

            friendsService
                .getFriends()
                .then(function (data) {
                    $scope.friendsArray = data.friends;
                    // $scope.myCurrentStatus = data.my_current_status;
                });

            checkAfterRegister();

            /********************************************************** Обработчики сокетов ******************************************************/

            // Событие получения бана
            $scope.$on('ViolationCreated', function (e, data) {
                var toNoty = {
                    'life_type': data.life_type,
                    'violation_type': data.violation_type,
                    'match_id': data.match_id,
                    'expire_time': data.expire_time
                };
                showSystemNoty('newBanan', 'YOU_GOT_BANNED', toNoty);
            });

            $scope.$on('VIOLATION_CREATED', function (e, data) {
                var toNoty = {
                    'money_count': data.money_count,
                    'violation_type': data.violation_type,
                    'user_name': data.user_name,
                    'expire_time': data.expire_time,
                    'reported_by': data.reported_by,
                    'users_group': data.users_group,
                    'reported_name': data.reported_name
                };
                showSystemNoty('socketBan', 'YOU_GOT_NEW_BAN', toNoty);
            });

            // Событие прихода нового уведомления
            $scope.$on('FRIEND_INVITED', function (e, data) {
                friendsService
                    .getInfo(data.friendId)
                    .then(function (friend) {
                        var toNoty = {
                            'name': friend.name,
                            'id': friend.friendId
                        };
                        showSystemNoty('inviteFriend', 'INVITES_YOU_TO_FRIENDS', toNoty);
                    });
            });

            // Событие, если кто-то принял заявку в друзья
            $scope.$on('FRIEND_ACCEPTED', function (e, data) {
                friendsService
                    .getInfo(data.friendId)
                    .then(function (friend) {
                        var toNoty = {
                            'name': friend.name,
                            'id': friend.friendId
                        };
                        showSystemNoty('acceptedFriend', 'ACCEPTED_YOUR_INVITE', toNoty);
                    });

                friendsService
                    .getFriends()
                    .then(function (data) {
                        $scope.friendsArray = data.friends;
                        // $scope.myCurrentStatus = data.my_current_status;
                    });
            });

            // Событие, если кто-то отменил заявку в друзья
            $scope.$on('FRIEND_DECLINED', function (e, data) {
                friendsService
                    .getInfo(data.friendId)
                    .then(function (friend) {
                        var toNoty = {
                            'name': friend.name,
                            'id': friend.userId
                        };

                        showSystemNoty('declinedFriend', 'DECLINE_YOUR_INVITE', toNoty);

                        for (var i = 0; i < $scope.friendsArray.length; i++){
                            if ($scope.friendsArray[i].userId == data.friendId) {
                                $scope.friendsArray.splice(i, 1);
                                break;
                            }
                        }
                    });
            });

            // Событие при смене статуса друга
            $scope.$on('FRIEND_STATUS_UPDATE', function (e, data) {
                userStatusMap[data.friendId] = data.status;
            });
            
            $scope.$on('USER_STATUSES', function (e, data) {
                angular.extend(userStatusMap, data.statuses);
            });

            // Приходящее уведомление с админки или откуда угодно
            $scope.$on('SYSTEM', function (e, data) {
                showSystemNoty('system_noty', 'ACCEPTED_YOUR_INVITE', data.message);
            });


            /**************************************************************** COOKIES *******************************************************/

            // Выполняем первый чек
            firstCheck();
        }

        // Первый чек куки при открытии страницы
        function firstCheck() {
            $scope.getCookie = $cookies.get('checkCookie');
            if (!$scope.getCookie) {
                showSystemNoty('cookiesNoty', 'COOKIES_NOTIFICATION', '');
            }
        }

        // Показ уведомлений о подтверждении почты
        function checkAfterRegister() {
            var userProfile = userProfileService.getUserProfile();

            if (userProfile && userProfile.userData && !userProfile.userData.emailValidated) {
                showSystemNoty('register_noty', 'Check your email', 'EXPERIMENT_TOPALERT_VERIFY');
            }
            if (showOldBrowserMessage()) {
                showSystemNoty('register_noty', 'Check your email', 'MAIN__OLD_BROWSER_NOTIFICATION');
            }

        }

        function showOldBrowserMessage() {
            if (!userProfileService.getUserProfile()) {
                return undefined;
            }

            var unsupportedBrowser =
                /MSIE/i.test(navigator.userAgent) || //IE 9-11
                /rv:11.0/i.test(navigator.userAgent) || //IE 11
                /Edge/i.test(navigator.userAgent) || //Edge
                /firefox/i.test(navigator.userAgent); //FF
            return unsupportedBrowser || !socketService.isWebSocketSupported();
        }

        // Ставим куки, если пользователь нажал "ОК"
        function setCookies() {
            $cookies.put('checkCookie', true);
            $scope.notyCounter--;

            closeSystemNoty();
            firstCheck();
        }

        // Показать системное уведомление
        function showSystemNoty(type, head, data) {
            var notyData = {
                'type': type,
                'head': head,
                'data': data
            };
            var error = false;
            $scope.systemNoty.forEach(function (f) {
                if (f.type == type) {
                    if (f.data.name){
                        if (f.data.name == data.name) {
                            error = true;
                        }
                    }
                }
            });
            if (!error) {
                $scope.systemNoty.push(notyData);
            }
            console.log("Массив уведомлений:", $scope.systemNoty);
        }

        // Открытие уведомления из списка
        function openSystemNoty(id, data) {
            $scope.showOverlayNotyList = false;
            $scope.showFriends = false;
            $scope.showOverlayNoty = true;
            $scope.openedNotyData = data;
            $scope.openedNotyId = id;
        }

        // Отобажения скрытого уведомления
        function showNoties() {
            if ($scope.systemNoty.length > 0) {
                if ($scope.systemNoty.length == 1) {
                    $scope.openSystemNoty(0, $scope.systemNoty[0]);
                    $scope.showOverlayNoty = true;
                }
                if ($scope.systemNoty.length !== 1) {
                    $scope.showFriends = false;
                    $scope.showOverlayNotyList = true;
                }
            }
        }

        // Зыкрытие уведомления
        function closeSystemNoty() {
            $scope.systemNoty.splice($scope.openedNotyId, 1);
            $scope.showOverlayNoty = false;
            console.log("Массив уведомлений:", $scope.systemNoty);
        }

        function countFriends() {
            if (!$scope.friendsArray){
                return 0;
            }

            var count = 0;

            for (var i = 0; i < $scope.friendsArray.length; i++){
                var friend = $scope.friendsArray[i];

                if (friend.relation === 'FRIEND'){
                    count++
                }
            }

            return count;
        }

        function countOnlineFriends() {
            if (!$scope.friendsArray){
                return 0;
            }

            var count = 0;

            for (var i = 0; i < $scope.friendsArray.length; i++){
                var friend = $scope.friendsArray[i];

                if (friend.relation === 'FRIEND' && friend.status !== 'offline'){
                    count++;
                }
            }

            return count;
        }


        function countNewFriends() {
            if (!$scope.friendsArray){
                return 0;
            }

            var count = 0;

            for (var i = 0; i < $scope.friendsArray.length; i++){
                var friend = $scope.friendsArray[i];

                if (friend.relation === 'REQUEST'){
                    count++
                }
            }

            return count;
        }

        // Получения информации о пользователе
        function getUserInfo(userId, key) {
            $scope.keyValue = key;

            friendsService
                .getInfo(userId)
                .then(function (friend) {
                    $scope.humanData = friend;
                });
        }

        // Отправки приглашения в друзья
        function sendInvite(userId) {
            friendsService
                .add(userId)
                .then(function (data) {
                    $scope.friendsArray = data.friends;
                });
        }

        // Блокировки пользователя
        function blockUser(userId) {
            friendsService
                .add(userId)
                .then(function (data) {
                    $scope.friendsArray = data.friends;
                    //TODO добавить обработчик блокировки пользователя
                });
        }

        // Смены статуса
        function changeStatus() {
            var statusMap = {
                online: 'idle',
                idle: 'busy',
                busy: 'online',
                offline: 'online'
            };
            var currentStatus = getMyStatus();
            var status = statusMap[currentStatus];
            
            if (!status){
                return;
            }

            friendsService
                .changeStatus(status)
                .then(function () {
                    var userProfile = userProfileService.getUserProfile();
                    userStatusMap[userProfile.userData.id] = status;
                });
        }

        // Принятие приглашения в друзья
        function acceptFriend(userId) {
            friendsService
                .accept(userId)
                .then(function (data) {
                    $scope.friendsArray = data.friends;

                    closeSystemNoty();
                });
        }

        // Отмена приглашения в друзья
        function declineFriend(userId) {
            friendsService
                .decline(userId)
                .then(function (data) {
                    $scope.friendsArray = data.friends;

                    closeSystemNoty();
                });
        }

        // Удаления из друзей
        function deleteFriend(userId) {
            friendsService
                .decline(userId)
                .then(function successCallback(data) {
                    $scope.friendsArray = data.friends;
                });

        }

        /**************************************************************** SEARCH ******************************************************/

        // Поиск друзей на всей платформе
        function searchUserInput() {
            if ($scope.searchFriend.length > 3) {
                friendsService
                    .search($scope.searchFriend)
                    .then(function (data) {
                        $scope.showSearchUser = true;
                        $scope.searchArray = data;
                    });
            }

            if ($scope.searchFriend.length === 0) {
                $scope.showSearchUser = false;
            }
        }

        /****************************************************************** CHATS **********************************************************/

        // Удаление чата
        function delChat(chatId) {
            $scope.senders.forEach(function (f, i) {
                if (f.id == chatId) {
                    console.log(f);
                    $scope.senders.splice(i, 1);
                }
            });
            $scope.showChatArea = false;
        }

        // Создания чата с френдом
        function createChat(userId, userName) {
            $scope.createNewChatError = false;
            $scope.addedData = {
                'id': userId,
                'userName': userName,
                'msgs': []
            };
            $scope.senders.forEach(function (f) {
                if (f.id == userId) {
                    $scope.createNewChatError = true;
                }
            });
            if ($scope.createNewChatError === false) {
                $scope.senders.push($scope.addedData);
                $scope.showChatArea = true;
                $scope.chatId = userId;
            }
        }

        // Обработка сообщений чата
        function sendP2PChatMsg(msg) {
            if (msg.sender == $rootScope.userProfile.userData.id) {
                $scope.senders.forEach(function (f) {
                    if (f.id == msg.receiver) {
                        $scope.p2pMsg = {
                            'date': msg.date,
                            'room_id': msg.id,
                            'sender': msg.sender,
                            'sender_name': $rootScope.userProfile.userData.name,
                            'text': msg.text,
                            'message_type': 'P2P'
                        };
                        f.msgs.push($scope.p2pMsg);
                        scrollTopAnything(msg.receiver);
                    }
                });
            }
            else {
                var haveInclude = false;

                $scope.senders.forEach(function (f) {
                    if (f.id == msg.sender) {
                        haveInclude = true;
                    }
                });

                if (haveInclude == false) {
                    friendsService
                        .getInfo(msg.sender)
                        .then(function successCallback(friend) {
                            var tempSenderdata = {
                                'id': msg.sender,
                                'userName': friend.name,
                                'msgs': []
                            };

                            $scope.senders.push(tempSenderdata);
                            scrollTopAnything(msg.sender);

                            $scope.senders.forEach(function (f) {
                                if (f.id == msg.sender) {
                                    $scope.p2pMsg = {
                                        'date': msg.date,
                                        'room_id': msg.id,
                                        'sender': msg.sender,
                                        'sender_name': friend.name,
                                        'text': msg.text,
                                        'message_type': 'P2P'
                                    };
                                    f.msgs.push($scope.p2pMsg);
                                    scrollTopAnything(msg.sender);
                                }
                            });
                        });
                }
                else {
                    $scope.senders.forEach(function (f) {
                        if (f.id == msg.sender) {
                            $scope.p2pMsg = {
                                'date': msg.date,
                                'room_id': msg.id,
                                'sender': msg.sender,
                                'sender_name': f.userName,
                                'text': msg.text,
                                'message_type': 'P2P'
                            };
                            f.msgs.push($scope.p2pMsg);
                            scrollTopAnything(msg.sender);
                        }
                    });
                }
            }
            // Воспроизведение звука входящего сообщения
            if (msg.sender !== $rootScope.userProfile.userData.id) {
                document.getElementById('pToPChatMsg').play();
                document.getElementById('pToPChatMsg').volume = 0.2;
            }
        }

        function wsOpenDetect() {
            return socketService.isOpened();
        }
        
        function getStatusClass(status) {
            return statusClassMap[status] || '';
        }
        
        function getUserStatus(userId) {
            return userStatusMap[userId];
        }
        
        function getMyStatus() {
            var userProfile = userProfileService.getUserProfile();
            
            if (!userProfile){
                return;
            }
            
            return getUserStatus(userProfile.userData.id);
        }

        // Вызов скролла для окна чата
        function scrollTopAnything(id) {
            $timeout(function() {
                var data = document.getElementById(id);
                data.scrollTop = 9999999;
            }, 100);
        }
    }
})();