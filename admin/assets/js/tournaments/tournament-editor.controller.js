(function () {
    'use strict';

    angular
        .module('gsadmin')
        .controller('TournamentEditor', TournamentEditor);

    TournamentEditor.$inject = ['$scope', '$routeParams', '$q', '$location', '$timeout', 'timezoneFactory', 'tournamentService'];

    /* @ngInject */
    /**
     * Контроллер создания и редактирования турниров
     * @param $scope
     * @param {{ [id]: number, [cloneId]: number }} $routeParams
     * @param {angular.IQService} $q
     * @param {timezoneFactory} timezoneFactory
     * @param {angular.ILocationService} $location
     * @param {angular.ITimeoutService} $timeout
     * @param {tournamentService} tournamentService
     * @constructor
     */
    function TournamentEditor($scope, $routeParams, $q, $location, $timeout, timezoneFactory, tournamentService) {
        var vm = this;

        vm.isNew = !$routeParams.id;
        vm.isClone = !!$routeParams.cloneId;
        vm.loading = false;
        vm.regions = undefined;
        vm.tourTypes = undefined;
        vm.error = null;
        vm.success = null;
        vm.tourClasses = [
            {id: 'NORMAL', name: 'NORMAL'},
            {id: 'SIT_AND_GO', name: 'SIT_AND_GO'},
            {id: 'WITH_REBUY', name: 'WITH_REBUY'}
        ];
        vm.awardTypes = [
            {id: 'STAR_POINTS', name: 'STAR_POINTS'},
            {id: 'TOURNAMENT_POINTS', name: 'TOURNAMENT_POINTS'},
            {id: 'REAL_POINTS', name: 'REAL_POINTS'}
        ];
        vm.languages = ['ru', 'en', 'fr'];
        vm.awardsTypes = [
            {id: 'list', name: 'Призовые места'},
            {id: 'description', name: 'Описание'}
        ];
        vm.rebuyTypes = [
            {id: 'ALL', name: 'ALL'},
            {id: 'BID_LESS', name: 'BID_LESS'},
            {id: 'STACK_LESS', name: 'STACK_LESS'},
            {id: 'ADDON', name: 'ADDON'}
        ];
        vm.awardComputings = [
            {id: 'TOP_PERCENTAGE_BY_CHIPS', name: 'TOP_PERCENTAGE_BY_CHIPS'},
            {id: 'TOP_PERCENTAGE_BY_PLACE', name: 'TOP_PERCENTAGE_BY_PLACE'},
            {id: 'TOP_BY_CHIPS', name: 'TOP_BY_CHIPS'},
            {id: 'TABLE_BY_PLACE', name: 'TABLE_BY_PLACE'}
        ];
        vm.awardsType = vm.awardsTypes[0].id;
        vm.awardsList = [];
        vm.awardText = {award_text: {}};
        vm.timezones = [];
        vm.tour = {
            name: '',
            active: true,
            tournamentClass: vm.tourClasses[0].id,
            awardType: vm.awardTypes[2].id,
            regStartDate: moment().startOf('day').valueOf(),
            regEndDate: moment().startOf('day').valueOf(),
            startDate: moment().startOf('day').valueOf(),
            endDate: moment().startOf('day').valueOf(),
            beginTime: "00:00:00",
            endTime: "23:59:59",
            timeZone: 'Europe/Berlin',
            awardFund: 0,
            awardCount: 0,
            awards: null,
            awardComputing: vm.awardComputings[0].id,
            coverPictureId: 1,
            backgroundPictureId: 1,
            tags: [],
            gameRegion: {id: undefined},
            description: {text: {}, createTime: undefined},
            tournamentRebuys: [],
            blinds: [],
            buyIns: [],
            tournamentSettings: {
                minAccountLevel: 30,
                maxAccountLevel: 0,
                minAccountRating: 0,
                maxAccountRating: 0,
                bonusJoinMinActiveMembers: 100,
                bonusJoinAdditionSum: 100,
                bonusRebuyAdditionSum: 100,
                bonusRebuyMinActiveMembers: 1000,
                checkDesktopClient: true,
                startMemberCount: 10,
                startDelay: 100,
                duration: 100,
                endRegDelay: 100,
                qualifyMinMatch: 1
            }
        };

        vm.coversImgData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,45,46,47,50,51,52,53,54,55,58,60,63,64,65,66];
        vm.tourImgData = [1,2,3,4,6];
        vm.tagsTextArea = '';
        vm.regStartDate = undefined;
        vm.startDate = undefined;
        vm.regEndDate = undefined;
        vm.endDate = undefined;

        vm.addAward = addAward;
        vm.removeAward = removeAward;
        vm.addRebuy = addRebuy;
        vm.removeRebuy = removeRebuy;
        vm.addBlind = addBlind;
        vm.removeBlind = removeBlind;
        vm.save = save;
        vm.isFormValid = isFormValid;
        vm.removeBuyIn = removeBuyIn;
        vm.addBuyIn = addBuyIn;
        vm.onBuyInDefaultChange = onBuyInDefaultChange;
        vm.deleteSomeTag = deleteSomeTag;

        $scope.rebuy_active = undefined;
        $scope.rebuy_quantity = undefined;
        $scope.rebuy_amount = undefined;
        $scope.rebuy_cost = undefined;
        $scope.rebuy_fromMinutes = undefined;
        $scope.rebuy_duration = undefined;
        $scope.rebuy_rebuyType = undefined;
        $scope.rebuy_rebuyCurrency = vm.tour.awardType;
        $scope.rebuy_stackLimit = undefined;
        
        $scope.blind_info = undefined;
        $scope.blind_fromMinutes = undefined;
        $scope.blind_duration = undefined;
        $scope.blind_min = undefined;
        $scope.blind_maxRatio = undefined;
        
        $scope.buyin_default = true;
        $scope.buyin_stack = 1000;
        $scope.buyin_currencyType = vm.awardTypes[2].id;
        $scope.buyin_value = undefined;

        $scope.award_fromPos = 1;
        $scope.award_toPos = 1;
        $scope.award_value = 0;

        activate();

        function activate() {
            if ($location.search()['success']) {
                vm.success = true;
            }

            $('#tournament-tabs').on('click', 'a', function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            vm.timezones = timezoneFactory.get();
            vm.timezones.sort(function (a, b) {
                return a.nOffset - b.nOffset;
            });

            getDataFromServer()
                .then(function () {
                    //TODO: костыль
                    $timeout(function () {
                        for (var i = 0; i < vm.languages.length; i++) {
                            var lang = vm.languages[i];
                            // Replace the <textarea id="editor1"> with a CKEditor
                            // instance, using default configuration.
                            CKEDITOR.replace('description-' + lang);

                            if (!vm.isNew || vm.isClone) {
                                var text = vm.tour.description && vm.tour.description.text[lang];
                                if (text) {
                                    CKEDITOR.instances['description-' + lang].setData(text);
                                }
                            }
                        }
                    }, 100);

                    if (!vm.isNew || vm.isClone) {
                        if (angular.isArray(vm.tour.awards)) {
                            vm.awardsType = 'list';
                            vm.awardsList = vm.tour.awards;
                        }
                        else {
                            vm.awardsType = 'description';
                            vm.awardText = vm.tour.awards;
                        }
                    }

                    vm.tour.beginTime = formatTime(vm.tour.beginTime);
                    vm.tour.endTime = formatTime(vm.tour.endTime);

                    initDates();
                });
        }

        function initDates() {
            var tzDelta = moment().utcOffset() - moment.tz(vm.tour.timeZone).utcOffset();

            vm.regStartDate = formatDate(vm.tour.regStartDate, tzDelta);
            vm.startDate = formatDate(vm.tour.startDate, tzDelta);
            vm.regEndDate = formatDate(vm.tour.regEndDate, tzDelta);
            vm.endDate = formatDate(vm.tour.endDate, tzDelta);
        }

        /**
         * Коныертация ms в date с учетом сдвига часовых поясов
         * @param {number} date - дата в ms
         * @param {number} tzDelta - разность в минутах между часовым поясом админа и часовым поясом даты/времени
         * @return {Date}
         */
        function formatDate(date, tzDelta) {
            if (!date){
                return;
            }

            return moment(date).subtract(tzDelta, 'minutes').startOf('minute').toDate();
        }

        /**
         * Конвертация date в ms с учетом сдвига часовых поясов
         * @param {Date} date
         * @param {number} tzDelta - разность в минутах между часовым поясом админа и часовым поясом даты/времени
         * @return {number | null}
         */
        function parseDate(date, tzDelta) {
            if (!date) {
                return null;
            }

            return moment(date).add(tzDelta, 'minutes').valueOf();
        }

        function formatTime(time) {
            if (!time || !angular.isObject(time)) {
                return time;
            }

            return moment([2016, 0, 1, time.hour, time.minute, time.second]).format('HH:mm:ss');
        }

        /**
         * Удаление любого тега
         * @returns {angular.IPromise<*>}
         */
        function deleteSomeTag(key) {
            vm.tour.tags.splice(key, 1);
        }

        /**
         * Выполнение всех необходимых асинхронных запросов
         * @returns {angular.IPromise<*>}
         */
        function getDataFromServer() {
            var promises = [];

            promises.push(getGames());

            if (!vm.isNew || vm.isClone) {
                promises.push(getTournament());
            }

            return $q.all(promises);
        }

        /**
         * @returns {angular.IPromise<*>}
         */
        function getTournament() {
            return tournamentService
                .getTournament($routeParams.id || $routeParams.cloneId)
                .then(function (tournament) {
                    if (vm.isClone) {
                        vm.tour = prepareClone(tournament);
                    }
                    else {
                        vm.tour = tournament;
                    }
                });
        }

        /**
         * @returns {angular.IPromise<*>}
         */
        function getGames() {
            return tournamentService
                .getGames()
                .then(function (regions) {
                    vm.regions = regions;
                });
        }

        function addAward() {
            var data = {
                award: $scope.award_value,
                toPos: $scope.award_toPos,
                fromPos: $scope.award_fromPos
            };

            vm.awardsList.push(data);
        }

        function removeAward(index) {
            vm.awardsList.splice(index, 1);
        }

        function addRebuy() {
            var data = {
                active: $scope.rebuy_active,
                quantity: $scope.rebuy_quantity,
                amount: $scope.rebuy_amount,
                cost: $scope.rebuy_cost,
                fromMinutes: $scope.rebuy_fromMinutes,
                duration: $scope.rebuy_duration,
                rebuyType: $scope.rebuy_rebuyType,
                rebuyCurrency: $scope.rebuy_rebuyCurrency,
                stackLimit: $scope.rebuy_stackLimit
            };

            vm.tour.tournamentRebuys.push(data);

            // $scope.rebuy_active = undefined;
            // $scope.rebuy_quantity = undefined;
            // $scope.rebuy_amount = undefined;
            // $scope.rebuy_cost = undefined;
            // $scope.rebuy_fromMinutes = undefined;
            // $scope.rebuy_duration = undefined;
            // $scope.rebuy_rebuyType = undefined;
            // $scope.rebuy_rebuyCurrency = undefined;
        }

        function removeRebuy(index) {
            vm.tour.tournamentRebuys.splice(index, 1);
        }

        function addBlind() {
            var data = {
                info: $scope.blind_info,
                fromMinutes: $scope.blind_fromMinutes,
                duration: $scope.blind_duration,
                min: $scope.blind_min,
                maxRatio: $scope.blind_maxRatio
            };

            vm.tour.blinds.push(data);

            // $scope.blind_info = undefined;
            // $scope.blind_fromMinutes = undefined;
            // $scope.blind_duration = undefined;
            // $scope.blind_min = undefined;
            // $scope.blind_maxRatio = undefined;
        }

        function removeBlind(index) {
            vm.tour.blinds.splice(index, 1);
        }

        function addBuyIn() {
            var data = {
                isDefault: $scope.buyin_default,
                currencyType: $scope.buyin_currencyType,
                stack: $scope.buyin_stack,
                value: $scope.buyin_value
            };

            if (data.isDefault) {
                for (var i = 0; i < vm.tour.buyIns.length; i++) {
                    vm.tour.buyIns[i].isDefault = false;
                }
            }

            vm.tour.buyIns.push(data);

            $scope.buyin_default = false;
        }

        function removeBuyIn(index) {
            var buyIn = vm.tour.buyIns.splice(index)[0];
            if (buyIn.isDefault && vm.tour.buyIns.length) {
                vm.tour.buyIns[0].isDefault = true;
            }
        }

        function onBuyInDefaultChange(buyIn) {
            for (var i = 0; i < vm.tour.buyIns.length; i++) {
                vm.tour.buyIns[i].isDefault = false;
            }

            buyIn.isDefault = true;
        }

        function save() {

            if (vm.tagsTextArea !== '' && vm.tagsTextArea !== ' ') {
                var newTags = vm.tagsTextArea.replace(/\s+/g, '');
                var newTagsArray = newTags.split(',');
                newTagsArray.forEach(function (f) {
                    if (vm.tour.tags.indexOf(f) === -1) {
                        vm.tour.tags.push(f);
                    }
                });

                vm.tagsTextArea = '';
            }

            for (var i = 0; i < vm.languages.length; i++) {
                var lang = vm.languages[i];
                vm.tour.description.text[lang] = CKEDITOR.instances['description-' + lang].getData();
            }
            vm.tour.description.createTime = Date.now();

            if (vm.awardsType === 'list') {
                vm.tour.awards = vm.awardsList;
            }
            else {
                vm.tour.awards = vm.awardText;
            }

            if (vm.tour.tournamentClass !== vm.tourClasses[0].id) {
                vm.regEndDate = null;
                vm.startDate = null;
                vm.endDate = null;
            }

            var tzDelta = moment().utcOffset() - moment.tz(vm.tour.timeZone).utcOffset();
            vm.tour.regStartDate = parseDate(vm.regStartDate, tzDelta);
            vm.tour.startDate = parseDate(vm.startDate, tzDelta);
            vm.tour.regEndDate = parseDate(vm.regEndDate, tzDelta);
            vm.tour.endDate = parseDate(vm.endDate, tzDelta);

            var data = vm.tour;
            /** @type {angular.IHttpPromise<*>} */
            var request;

            if (vm.isNew) {
                request = tournamentService.createTournament(data);
            }
            else {
                request = tournamentService.updateTournament($routeParams.id, data);
            }

            vm.loading = true;
            vm.success = null;
            vm.error = null;

            request
                .then(function (response) {
                    vm.success = true;
                    if (vm.isNew) {
                        $location.path('/tournament/edit/' + response.data.id);
                        $location.search('success');
                    }
                })
                .catch(function (response) {
                    vm.error = JSON.stringify(response.data.error);
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function isFormValid() {
            var form = $scope.form;
            return form.$valid || (
                form.name.$valid &&
                form.timezone.$valid &&
                form.regStartDate.$valid &&
                form.gameRegion.$valid);
        }

        function prepareClone(tournament) {
            var clone = {};

            for (var prop in vm.tour) {
                clone[prop] = tournament[prop];
            }

            removeId(clone);
            
            return clone;
        }

        /**
         * Рекурсивно удаляет из объекта все id и tournamentId для корректного сохранения
         * скопированного турнира
         * @param {*} obj
         */
        function removeId(obj) {
            if (angular.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    removeId(obj[i]);
                }
            }
            else {
                if (angular.isObject(obj)) {
                    delete obj.id;
                    delete obj.tournamentId;
                    delete obj.externalId;

                    for (var prop in obj) {
                        if (prop === 'gameRegion') {
                            continue;
                        }

                        removeId(obj[prop]);
                    }
                }
            }
        }
    }

})();
