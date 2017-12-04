gamestar.service('saitConfig', function($rootScope){
    $rootScope.config = {
        version: '1.0.1', //Текущая версия сайта
        template: 'hs', //Шаблон сайта
        theme: 'default', //Тема сайта
        subdomain: 'hs', //Поддомен проекта
        mainUrl: window.location.host.replace(/hs./g, ''), //Поддомен проекта
        currentUrl: 'http://' + window.location.host, //URL корневого домена
        vkontakteUrl: 'http://vk.com/gamestars', //Ссылка на страницу вконтакте
        facebookUrl: 'https://www.facebook.com/groups/gamestarsgg/', //Ссылка на страницу фейсбука
        game: {
            lol: true,
            hs: true,
            wot: false,
            dota: false,
            cs: false
        }
    }
})