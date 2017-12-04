(function () {
    'use strict';

    angular
        .module('gamestar')
        .constant('config', {
            version: '1.6.3', //Текущая версия сайта
            template: 'lol', //Шаблон сайта
            theme: 'default', //Тема сайта
            subdomain: 'lol', //Поддомен проекта
            currentUrl: window.location.host,
            mainUrl: window.location.host.replace(/lol[.]/, ''), //URL корневого сайта
            adminUrl: '//admin.' + window.location.host.replace(/lol[.]/, ''), //URL админки
            newsUrl: '//news.' + window.location.host.replace(/lol[.]/, ''), //URL форума
            vkontakteUrl: 'http://vk.com/gamestars', //Ссылка на страницу вконтакте
            facebookUrl: 'https://www.facebook.com/gamestarsgg/', //Ссылка на страницу фейсбука
            game: {
                lol: true,
                hs: false,
                wot: false,
                dota: false,
                cs: false
            },
            languages: ['RU', 'EN', 'FR'],
            p2pChats: {
                prefix: 'p2pchat',
                type: 'CHAT_DIRECT'
            },
            generalChat: {
                prefix: 'group_general',
                type: 'CHAT_MESSAGE'
            }
        });
})();
