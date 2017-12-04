### Для начала работы следует не забыть поставить компоненты: ###
npm install &&  bower prune &&
bower install

On Mac:
sudo npm install -g gulp bower &&
npm install &&  bower prune &&
bower install

Linux
curl -sL https://deb.nodesource.com/setup_0.12 | bash -
apt-get install -y nodejs
apt-get install -y build-essential

npm install -g gulp bower;
ln -s /usr/bin/nodejs /usr/bin/node;
npm install &&  bower prune &&
bower install
bower update

If got exception "Agreeing to the Xcode/iOS license requires admin privileges, please re-run as root via sudo." ->
sudo xcodebuild -license


##Прописываем в хостах!!!
sudo nano /private/etc/hosts
(для win - открываем блокнот от имени администратора C:\Windows\System32\drivers\etc\hosts)
127.0.0.1 gamestars.local
127.0.0.1 lol.gamestars.local
127.0.0.1 admin.gamestars.local
127.0.0.1 forum.gamestars.local


### В проекте настроен локальный фронт сервер (бек от девелоперского окружения game-stars.ru), запускается простой командой: ###
gulp watch

###Для запуска с локально поднятым беком ###
gulp watchLocal


If got exception "You already have a server listening on 35729"
lsof | grep 35729
kill -9  {proccedID}

### Сборка JS компонентов(из bower) происходит через команду: ###
gulp js-vendor // --> ./public/vendor.js 

### Production build: ###
С флагом --prod включается минификация нашего JS. (Так же можно запускать "gulp watch --prod" и т.д.)
gulp build --prod

### Фронты работают теперь на gamestars.local:9360


****
**P.s.
просьба не включать папки bower_components и node_modules и их компоненты в проект.**