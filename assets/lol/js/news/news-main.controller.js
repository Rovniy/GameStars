(function () {
    'use strict';

    angular
        .module('gamestar')
        .controller('NewsMainController', NewsMainController);

    NewsMainController.$inject = ['$window', 'newsService', 'config'];

    /* @ngInject */
    /**
     * @param {angular.IWindowService} $window
     * @param {newsService} newsService
     * @param {config} config
     * @constructor
     */
    function NewsMainController($window, newsService, config) {
        var vm = this;

        vm.news = undefined;
        vm.config = config;

        vm.openNews = openNews;

        activate();

        ////////////////

        function activate() {
            return newsService
                .getNews(3)
                .then(function(news){
                    vm.news = news;
                });
        }

        function openNews(news) {
            $window.open(news.thread_id)
        }
    }

})();