(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .service('friendsService', friendsService);

    friendsService.$inject = ['$http'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     */
    function friendsService($http) {
        this.getFriends = getFriends;
        this.getInfo = getInfo;
        this.add = add;
        this.block = block;
        this.changeStatus = changeStatus;
        this.accept = accept;
        this.decline = decline;
        this.search = search;
        
        ////////////////
        
        /**
         * Получение списка друзей
         * @return {angular.IPromise<FriendsResponse>}
         */
        function getFriends() {
            return $http
                .get('/api/friends')
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         * @param {string} userId
         * @return {angular.IPromise<FriendModel>}
         */
        function getInfo(userId) {
            return $http
                .get('/api/friends/info?userId=' + userId)
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         * @param {string} userId
         * @return {angular.IPromise<FriendsResponse>}
         */
        function add(userId) {
            return $http
                .post('/api/friends/add?userId=' + userId, {})
                .then(function (response) {
                    return response.data
                });
        }

        /**
         * @param {string} userId
         * @return {angular.IPromise<FriendsResponse>}
         */
        function block(userId) {
            return $http
                .post('/api/friends/block?userId=' + userId, {})
                .then(function (response) {
                    return response.data
                });
        }

        /**
         * @param {string} status
         * @return {angular.IHttpPromise<T>}
         */
        function changeStatus(status) {
            return $http
                .post('/api/friends/changeStatus?status=' + status, {});
        }

        /**
         * @param {string} userId
         * @return {angular.IPromise<FriendsResponse>}
         */
        function accept(userId) {
            return $http
                .post('/api/friends/accept?userId=' + userId, {})
                .then(function (response) {
                    return response.data
                });
        }

        /**
         * @param {string} userId
         * @return {angular.IPromise<FriendsResponse>}
         */
        function decline(userId) {
            return $http
                .post('/api/friends/decline?userId=' + userId, {})
                .then(function (response) {
                    return response.data
                });
        }

        /**
         * @param {string} name
         * @return {angular.IPromise<FriendsResponse>}
         */
        function search(name) {
            return $http
                .get('/api/friends/search/' + name)
                .then(function (response) {
                    return response.data
                });
        }
    }

})();