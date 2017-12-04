(function () {
    'use strict';

    angular
        .module('gamestar')
        .service('newsService', newsService);

    newsService.$inject = ['$http', 'config'];

    /* @ngInject */
    /**
     * @param {angular.IHttpService} $http
     * @param {config} config
     */
    function newsService($http, config) {
        var defaultBgUrl = '/src/img/lol/news_defaut_bg.jpg';
        var newsServerAddres = config.newsUrl;

        this.getNews = getNews;

        ////////////////

        /**
         * Получение новостей, отсортированных по дате добавления
         * @param {number} [limit = 10] ограничение кол-ва постов
         * @returns {angular.IPromise<*>}
         */
        function getNews(limit) {
            if (!limit || limit < 1){
                limit = 10;
            }

            return $http
                .get('/api.php?action=getArticles&order_by=post_date&limit=' + limit)
                .then(getNewsComplete)
                .catch(getNewsFailed);

            function getNewsComplete(response){
                return response.data.articles.map(mapArticles);
            }

            function getNewsFailed(){
                return [];
            }

            function mapArticles(article){
                var viewUrl = article.article_icon && article.article_icon.data && article.article_icon.data.viewUrl ?
                    '/' + article.article_icon.data.viewUrl : defaultBgUrl;

                return {
                    title: article.title,
                    message: article.message,
                    like_count: article.like_count,
                    view_count: article.view_count,
                    reply_count: article.reply_count,
                    viewUrl: viewUrl,
                    thread_id: newsServerAddres +'/index.php/threads/' + article.thread_id
                }
            }
        }
    }

})();