var gulp = require('gulp');
// common
var lr = require('tiny-lr');
var livereload = require('gulp-livereload');
var lec = require('gulp-line-ending-corrector');
var concat = require('gulp-concat');
var server = lr();
var expect = require('gulp-expect-file');
// css
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
// js
var uglify = require('gulp-uglify');
var fileinclude = require('gulp-file-include');
var bower = require('gulp-bower');
var angularFilesort = require('gulp-angular-filesort');

var express = require('express');
var vhost = require('vhost');
var proxyMiddleware = require('http-proxy-middleware');
var revHash = require('gulp-rev-hash');
var hash_src = require("gulp-hash-src");
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var https = require('https');
var fs = require('fs');
var argv = require('yargs').argv;
var ifElse = require('gulp-if-else');
var angularTranslate = require('gulp-angular-translate');

// Js
gulp.task('js-base', ['localization'], function(){
    return gulp.src(['./assets/base/js/**/*.js', './sites/src/localization/translations.js'])
        .pipe(angularFilesort())
        .pipe(concat('base.js'))
        .pipe(ifElse(argv.prod, uglify))
        .pipe(lec({eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./sites/src/js'))
        .pipe(livereload(server));
});
// Js
var jsGen = function(name, target){
    target = target||name;
    return function(){
        return gulp.src(['./assets/'+name+'/js/**/*.js'])
            .pipe(angularFilesort())
            .pipe(concat('script.js'))
            .pipe(ifElse(argv.prod, uglify))
            .pipe(lec({eolc: 'LF', encoding:'utf8'}))
            .pipe(gulp.dest('./sites/'+name+'/js'))
            .pipe(livereload(server));
    };
};
gulp.task('js-root', jsGen('root'));
gulp.task('js-promo', jsGen('promo'));
gulp.task('js-lol', jsGen('lol'));
// gulp.task('js-hs', jsGen('hs'));

// Js admin
gulp.task('js-adm', function(){
    return gulp.src(['./admin/assets/js/**/*.js'])
        .pipe(angularFilesort())
        .pipe(concat('script.js'))
        .pipe(lec({eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./admin/js'))
        .pipe(livereload(server));
});

var jsPaths = [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/jquery/dist/jquery.min.js',

    // 'bower_components/jquery-ui/jquery-ui.min.js',
    'bower_components/jquery-ui/ui/minified/core.min.js',
    'bower_components/jquery-ui/ui/minified/widget.min.js',
    'bower_components/jquery-ui/ui/minified/mouse.min.js',
    'bower_components/jquery-ui/ui/minified/slider.min.js',

    'bower_components/Swiper/dist/js/swiper.min.js',
    'bower_components/jQuery-ui-Slider-Pips/dist/jquery-ui-slider-pips.min.js',
    'bower_components/atmosphere.js/atmosphere.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
    'bower_components/moment/min/moment.min.js',
    'bower_components/noty/js/noty/packaged/jquery.noty.packaged.min.js',
    'bower_components/angular-environment/dist/angular-environment.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    // 'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',
    'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
    'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
    'bower_components/angular-credit-cards/release/angular-credit-cards.js',
    'bower_components/clipboard/dist/clipboard.min.js',
    'bower_components/FlipClock/compiled/flipclock.min.js',
    'assets/base/lib/cryptojs.js',
    'assets/base/lib/intercom.min.js',
    'assets/base/lib/LockableStorage.js',
    'assets/base/lib/reconnecting-websocket.js',
    'assets/base/lib/ngscrollbar.js',
    'assets/base/lib/detect.min.js'
];

var jsPathsAdmin = [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',
    'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
    'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js',
    'bower_components/moment/min/moment.min.js',
    'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
    'bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
    'admin/assets/lib/jquery.dataTables.min.js',
    'admin/assets/lib/jquery.matchHeight-min.js',
    'admin/assets/lib/bootstrap.min.js',
    'admin/assets/lib/bootstrap-switch.min.js',
    'admin/assets/lib/Chart.min.js'
];
// Js Vendor
gulp.task('js-vendor', ['bower'], function(){
    return gulp.src(jsPaths)
        .pipe(expect(jsPaths))
        .pipe(concat('vendor.js'))
        .pipe(lec({ eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./sites/src/js'))
});

gulp.task('js-vendor-admin', ['bower'], function(){
    return gulp.src(jsPathsAdmin)
        .pipe(expect(jsPathsAdmin))
        .pipe(concat('vendor-admin.js'))
        .pipe(lec({eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./admin/js'))
});


var lessGen = function(name){
    return function (){
        return gulp.src('./assets/'+name+'/styles/_common.less')
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(concat('style.css'))
            .pipe(csso({
                comments: 'none'
            }))
            .pipe(lec({eolc: 'LF', encoding:'utf8'}))
            .pipe(gulp.dest('./sites/'+name+'/css'))
            .pipe(livereload(server));
    };
};

//LESS base
gulp.task('less-base', function () {
    return gulp.src('./assets/base/styles/_common.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('base.css'))
        .pipe(csso({
            comments: 'none'
        }))
        .pipe(lec({eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./sites/src/css'))
        .pipe(livereload(server));
});

//LESS sites
gulp.task('less-lol', lessGen('lol'));
// gulp.task('less-hs', lessGen('hs'));
gulp.task('less-root', lessGen('root'));
gulp.task('less-promo', lessGen('promo'));

gulp.task('less-adm', function () {
    return gulp.src('./admin/assets/styles/_common.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(csso({
            comments: 'none'
        }))
        .pipe(lec({eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./admin/css'))
        .pipe(livereload(server));
});

gulp.task('html-root',[], function() {
    return gulp.src(['./assets/root/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revHash({assetsDir: './sites'}))
        .pipe(hash_src({build_dir: "./sites/root", src_path: "./assets/root"}))
        .pipe(gulp.dest('./sites/root'));
});

// gulp.task('html-hs',['js-base','js-hs', 'templates'], function() {
//     return gulp.src(['./assets/hs/index.html'])
//         .pipe(fileinclude({
//             prefix: '@@',
//             basepath: '@file'
//         }))
//         .pipe(revHash({assetsDir: './sites'}))
//         .pipe(hash_src({build_dir: "./sites/hs", src_path: "./assets/hs/html"}))
//         .pipe(gulp.dest('./sites/hs'));
// });

gulp.task('html-lol',['js-base','js-lol', 'templates'], function() {
    return gulp.src(['./assets/lol/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revHash({assetsDir: './sites'}))
        .pipe(hash_src({build_dir: "./sites/lol", src_path: "./assets/lol"}))
        .pipe(gulp.dest('./sites/lol'));
});

gulp.task('html-promo',['js-base','js-promo', 'templates'], function() {
    return gulp.src(['./assets/promo/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revHash({assetsDir: './sites'}))
        .pipe(hash_src({build_dir: "./sites/promo", src_path: "./assets/promo"}))
        .pipe(gulp.dest('./sites/promo'));
});

/* TEMPLATES */
gulp.task('templates-root', [], function () {
    return gulp.src(['./assets/root/html/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true
        }))
        .pipe(templateCache('templates.js', {
            module: 'gamestar',
            root: '/'
        }))
        .pipe(gulp.dest('./sites/root/js'))
        .pipe(livereload(server));
});

// gulp.task('templates-hs', [], function () {
//     return gulp.src(['./assets/hs/html/*.html', '!./assets/hs/index.html'])
//         .pipe(templateCache('templates.js', {
//             module: 'gamestar',
//             root: '/'
//         }))
//         .pipe(gulp.dest('./sites/hs/js'))
//         .pipe(livereload(server));
// });

gulp.task('templates-lol', [], function () {
    return gulp.src(['./assets/lol/html/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true
        }))
        .pipe(templateCache('templates.js', {
            module: 'gamestar',
            root: '/'
        }))
        .pipe(gulp.dest('./sites/lol/js'))
        .pipe(livereload(server));
});

gulp.task('templates-promo', [], function () {
    return gulp.src(['./assets/promo/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true
        }))
        .pipe(templateCache('templates.js', {
            module: 'gamestar',
            root: '/'
        }))
        .pipe(gulp.dest('./sites/promo/js'))
        .pipe(livereload(server));
});

gulp.task('templates-base', [], function () {
    return gulp.src(['./assets/base/html/**/*.html', '!./sites/src/html/includes/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true
        }))
        .pipe(templateCache('templates-base.js', {
            module: 'gamestar.base',
            root: '/src/html/'
        }))
        .pipe(gulp.dest('./sites/src/js'))
        .pipe(livereload(server));
});

/**
 * Запуск bower install перед сборкой, что бы у всех всегда совпадали версии либ.
 */
gulp.task('bower', ['bower-prune'], function() {
    return bower();
});

gulp.task('bower-prune', function() {
    return bower({ cmd: 'prune'});
});

gulp.task('localization', function() {
    return gulp.src('./sites/src/localization/locale-*.json')
        .pipe(angularTranslate({
            module: 'gamestar.base',
            standalone: false
        }))
        .pipe(gulp.dest('./sites/src/localization/'));
});

gulp.task('base', ['js-base', 'less-base']);
gulp.task('root', ['html-root']);
gulp.task('lol', ['js-lol', 'less-lol', 'html-lol']);
gulp.task('promo', ['js-promo', 'less-promo', 'html-promo']);
// gulp.task('hs', ['js-hs', 'less-hs', 'html-hs']);
gulp.task('adm', ['js-adm','less-adm']);

gulp.task('templates', ['templates-base', 'templates-lol', 'templates-promo']);
gulp.task('html', ['html-root', 'html-lol', 'html-promo']);

gulp.task('build', ['base', 'root', 'adm', 'lol', 'promo']);

var taskWatch = function(){
    gulp.run('build');

    gulp.watch(['./assets/base/html/**/*.html'], ['html']);
    // gulp.watch(['./assets/root/html/**/*.html'], ['html-root']);
    gulp.watch(['./assets/lol/html/**/*.html'], ['html-lol']);
    // gulp.watch(['./assets/hs/html/**/*.html'], ['html-hs']);
    // gulp.watch(['./assets/promo/html/**/*.html'], ['html-promo']);

    gulp.watch(['./assets/base/styles/**/*.less'],['less-base']);
    // gulp.watch(['./assets/root/styles/**/*.less'],['less-root']);
    gulp.watch(['./assets/lol/styles/**/*.less'],['less-lol']);
    // gulp.watch(['./assets/promo/styles/**/*.less'],['less-promo']);
    // gulp.watch(['./assets/hs/styles/**/*.less'],['less-hs']);
    gulp.watch(['./admin/assets/styles/**/*.less'],['less-adm']);

    gulp.watch(['./assets/base/js/**/*.js'],['js-base', 'html-root', 'html-lol', 'html-promo']);
    // gulp.watch(['./assets/root/js/**/*.js'],['js-root', 'html-root']);
    gulp.watch(['./assets/lol/js/**/*.js'],['js-lol', 'html-lol']);
    // gulp.watch(['./assets/promo/js/**/*.js'],['js-promo', 'html-promo']);
    // gulp.watch(['./assets/hs/**/*.js'],['js-hs', 'html-hs']);
    gulp.watch(['./admin/assets/js/**/*.js'],['js-adm']);

    gulp.watch(['./sites/src/localization/locale-*.json'],['js-base']);
};

// Watch
gulp.task('watch', function() {//todo: переименовать watch в dev
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        taskWatch()
    });
    gulp.run('local-serverRu');
});

gulp.task('watchUs', function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        taskWatch()
    });
    gulp.run('local-serverUs');
});


gulp.task('watchLocal', function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        taskWatch();
    });
    gulp.run('local-serverLocal');
});

gulp.task('watchProd', function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        taskWatch();
    });
    gulp.run('local-serverProd');
});


gulp.task('watchArtem', function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        taskWatch();
    });
    gulp.run('local-artem');
});


// configure proxy middleware options
var options = {
    target: 'https://game-stars.ru', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                //console.log(cook[0].replace('Domain=.game-stars.ru','Domain=.gamestars.local'));
                proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.game-stars.ru','Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};
var optionsUs = {
    target: 'https://gamestars.us',               // needed for virtual hosted sites
    //target: 'http://192.168.1.143:9000/',               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                //console.log(cook[0].replace('Domain=.game-stars.ru','Domain=.gamestars.local'));
                proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.gamestars.us','Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};
var optionsNews = {
    target: 'http://news.game-stars.ru/', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('xf_session')>-1) {
                //proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.game-stars.ru','Domain=.gamestars.local');
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsLocal = {
    target: 'http://localhost:9000', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsLocalSocket = {
    target: 'http://localhost:9005', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsProd = {
    target: 'http://gamestars.gg', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.gamestars.gg','Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsProdNews = {
    target: 'https://news.gamestars.gg/', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('xf_session')>-1) {
                //proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.game-stars.ru','Domain=.gamestars.local');
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsArtem = {
    target: 'http://192.168.1.188:9000', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};

var optionsArtemSockets = {
    target: 'http://192.168.1.188:9005', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        var cookie = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0] + ('; Domain=.gamestars.local');
                console.log('cookie created successfully');
            }
        }
    }
};



var proxy = proxyMiddleware(['/api','/stream'], options);
var proxyNews = proxyMiddleware(['/api.php','/index.php'], optionsNews);

var proxyUs = proxyMiddleware(['/api','/stream'], optionsUs);

var proxyLocal = proxyMiddleware('/api', optionsLocal);
var proxyLocalSocket = proxyMiddleware('/stream', optionsLocalSocket);

var proxyProd = proxyMiddleware(['/api','/stream'], optionsProd);
var proxyProdNews = proxyMiddleware(['/api.php','/index.php'], optionsProdNews);

var proxyArtem = proxyMiddleware('/api', optionsArtem);
var proxyArtemSocket = proxyMiddleware('/stream', optionsArtemSockets);

var serverGenHttps = function(proxy1,proxy2, cb){

    var lolapp = express().use(express.static('./sites/lol')).get('/*', function(req, res, next){
        if ( req.path.indexOf('/src')>-1) return next();
        res.sendFile("index.html", {"root": __dirname + '/sites/lol'});
    });

    var adminapp = express().use(express.static('./admin')).get('/*', function(req, res, next){
        if ( req.path.indexOf('/src')>-1) return next();
        res.sendFile("index.html", {"root": __dirname + '/admin'});
    });

    return function() {
        var privateKey  = fs.readFileSync('gamestars.local.key', 'utf8');
        var certificate = fs.readFileSync('gamestars.local.cert', 'utf8');
        var credentials = {key: privateKey, cert: certificate};
        var app = express();

        app
            .use('/src', express.static('./sites/src'))
            .use(proxy1).on('upgrade', proxy1.upgrade)// -> api.php ->index.php
            .use(proxy2).on('upgrade', proxy2.upgrade) // -> stream -> api
            .use(vhost('gamestars.local', express.static("./sites/root")))
            .use(vhost('play.gamestars.local', express.static('./sites/play_en')))
            .use(vhost('fr.gamestars.local', express.static('./sites/play_fr')))
            .use(vhost('admin.gamestars.local', adminapp))
            .use(vhost('old.gamestars.local', express.static('old')))
            .use(vhost('lol.gamestars.local', lolapp));

        var httpsServer = https.createServer(credentials, app);
        httpsServer.listen(9360);

        cb()
    }
};

var serverGen = function(proxy1,proxy2, cb){

    var lolapp = express().use(express.static('./sites/lol')).get('/*', function(req, res, next){
        if ( req.path.indexOf('/src')>-1) return next();
        res.sendFile("index.html", {"root": __dirname + '/sites/lol'});
    });

    var promoapp = express().use(express.static('./sites/promo')).get('/*', function(req, res, next){
        if ( req.path.indexOf('/src')>-1) return next();
        res.sendFile("index.html", {"root": __dirname + '/sites/promo'});
    });

    var adminapp = express().use(express.static('./admin')).get('/*', function(req, res, next){
        if ( req.path.indexOf('/src')>-1) return next();
        res.sendFile("index.html", {"root": __dirname + '/admin'});
    });

    return function() {
       express()
            .use('/src', express.static('./sites/src'))
            .use(proxy1).on('upgrade', proxy1.upgrade)// -> api.php ->index.php
            .use(proxy2).on('upgrade', proxy2.upgrade) // -> stream -> api
            .use(vhost('gamestars.local', express.static("./sites/root")))
            .use(vhost('play.gamestars.local', express.static('./sites/play_en')))
            .use(vhost('fr.gamestars.local', express.static('./sites/play_fr')))
            .use(vhost('admin.gamestars.local', adminapp))
            .use(vhost('promo.gamestars.local', promoapp))
            .use(vhost('lol.gamestars.local', lolapp))//todo: пределать взад
            .listen(9360);

        cb()
    }
};


// Local server
gulp.task('local-serverRu', serverGen(proxy , proxyNews, function(){
        console.log('Server listening on http://game-stars.ru with remote back');
    })
);

// Local server
gulp.task('local-serverUs', serverGen(proxyUs , proxyNews, function(){
        console.log('Server listening on http://gamestars.us with remote back');
    })
);


gulp.task('local-serverLocal', serverGen(proxyLocal,proxyLocalSocket, function(){
        console.log('Server listening on http://gamestars.local:9360 with local back');
    })
);

gulp.task('local-serverProd', serverGenHttps(proxyProd,proxyProdNews, function(){
        console.log('Server listening on http://gamestars.gg with local back');
    })
);

gulp.task('local-artem', serverGen(proxyArtem,proxyArtemSocket, function(){
    taskWatch();
        console.log('Server listening on http://192.168.1.188:9000 with local back');
    })
);


// Default
gulp.task('default', function() {
    gulp.run('watch');
});